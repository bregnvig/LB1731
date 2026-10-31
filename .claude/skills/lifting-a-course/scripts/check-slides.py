#!/usr/bin/env python3
"""Check course slides against the slide types, or write the slide templates.

Every slide is one type, declared as <section data-template="<type>">. The type fixes which blocks the
slide has (by data-name), where they sit, the font sizes, fragments, and the word and code budgets.

Usage:
  python3 check-slides.py <course-dir> [...]       check visible slides (exit 1 on any problem)
  python3 check-slides.py --all <course-dir> [...] check hidden slides too
  python3 check-slides.py --write-templates <dir>  write one <type>.html per slide type
  python3 check-slides.py --describe               print the slide types as Markdown
"""
import html, json, re, subprocess, sys
from pathlib import Path

O = '<span style="color:#ff8c00">{}</span>'
C = '<code><span style="color:#ff8c00">{}</span></code>'

def b(name, kind, left, top, width, *, fragment=False, required=True, fonts=(), sample='', h1=False, height=None, corner=None):
    """One block of a slide type. top=None: any top. fragment=None: either. fonts: allowed inline font-size values."""
    return dict(name=name, kind=kind, left=left, top=top, width=width, fragment=fragment, required=required,
                fonts=set(fonts), sample=sample, height=height, corner=corner)

THEORY_TITLE = lambda text: b('title', 'text', 64, 96, 1150, sample=f'<h2>{text}</h2>')
EX_TITLE = lambda text: b('title', 'text', 64, 96, 1150, sample=f'<h2>{text}</h2>')
STEP = 'style="font-size:0.85em;line-height:1.35"'
EX = lambda s: f'<p {STEP}>{s}</p>'
LINE = lambda s: f'<p style="font-size:1.6em"><strong>{s}</strong></p>'
RESULT = lambda s: f'<h2 class="keep-case">{O.format(s)}</h2>'
STEPS = lambda *items: f'<ol {STEP}>\n' + '\n'.join(f'<li>{i}</li>' for i in items) + '\n</ol>'

TYPES = {
    'title': dict(
        what='First slide of a course: the course name, one short italic line, and the course image in the lower right (bottom-right corner at 1200,648, longest side 288px).',
        words=12, notes=False,
        blocks=[b('title', 'text', 102, 194, 1076, sample='<h1>Course name</h1>'),
                b('subtitle', 'text', 102, 258, 1076, sample='<h2><em>One short line</em></h2>'),
                b('image-1', 'image', None, None, None, sample='images/<course>-1.png', corner=(1200, 648, 288))]),
    'statement': dict(
        what='One big sentence or question on its own, e.g. "Time for questions 🤓".',
        words=12, notes=False,
        blocks=[b('title', 'text', 102, 274, 1076, sample='<h1>Time for questions 🤓</h1>')]),
    'reveal-list': dict(
        what='Three to five short phrases, one per click, then an optional punchline 48px below the last line. For categories and lists.',
        words=40, line_words=8,
        blocks=[THEORY_TITLE('What does "slow" mean?'),
                b('line-1', 'text', 64, 200, 1150, fragment=True, fonts={'1.6em'}, sample=LINE('Slow to respond')),
                b('line-2', 'text', 64, 280, 1150, fragment=True, fonts={'1.6em'}, sample=LINE('Slow to start')),
                b('line-3', 'text', 64, 360, 1150, fragment=True, fonts={'1.6em'}, sample=LINE('Slower over time')),
                b('line-4', 'text', 64, 440, 1150, fragment=True, fonts={'1.6em'}, required=False),
                b('line-5', 'text', 64, 520, 1150, fragment=True, fonts={'1.6em'}, required=False),
                b('punchline', 'text', 64, None, 1150, fragment=True, required=False,
                  sample=f'<p>Each has its own number. {O.format("Measure it before you fix it.")}</p>')]),
    'claim-code': dict(
        what='Up to three short claims on the left, the code that shows them on the right.',
        words=35, code_lines=8,
        blocks=[THEORY_TITLE('Running outside the zone'),
                b('claims', 'text', 64, 220, 480, sample='<ul>\n<li><code>runOutsideAngular</code>: zone.js stops triggering</li>\n<li>Wrap where listeners are added</li>\n</ul>'),
                b('code-1', 'code', 570, 220, 690, sample='private zone = inject(NgZone);'),
                b('punchline', 'text', 64, None, 1150, fragment=True, required=False, sample='<p>One short line.</p>')]),
    'claim-image': dict(
        what='Up to three short claims on the left, a cropped screenshot of what they describe on the right.',
        words=30,
        blocks=[THEORY_TITLE('Leaks in Angular apps'),
                b('claims', 'text', 64, 220, 520, sample='<ul>\n<li>A short claim</li>\n<li>Another short claim</li>\n</ul>'),
                b('image-1', 'image', 640, 220, 614, sample='images/screenshot.jpg'),
                b('punchline', 'text', 64, None, 1150, fragment=True, required=False, sample='<p>One short line.</p>')]),
    'code-pair': dict(
        what='Two code blocks side by side (before and after, or the definition and its use), one caption line.',
        words=15, code_lines=8,
        blocks=[THEORY_TITLE('Signal inputs in action'),
                b('code-1', 'code', 64, 200, 580, sample='// before'),
                b('code-2', 'code', 666, 200, 580, fragment=None, sample='// after'),
                b('caption', 'text', 64, None, 1150, fragment=None, required=False, sample='<p>One short line.</p>')]),
    'number': dict(
        what='One or two big measured results, then one line on why, 48px below.',
        words=20,
        blocks=[THEORY_TITLE('What we measured'),
                b('result-1', 'text', 64, 220, 1150, sample=RESULT('~290 → 5 bars')),
                b('result-2', 'text', 64, 320, 1150, fragment=True, required=False, sample=RESULT('1 bar = the whole app')),
                b('why', 'text', 64, None, 1150, fragment=None, required=False, sample='<p>One line on why.</p>')]),
    'wrap': dict(
        what="Last content slide: one line per technique with this app's number, the Monday line, the question.",
        words=50,
        blocks=[THEORY_TITLE('The fixes of the day'),
                b('line-1', 'text', 64, 200, 1150, sample='<p><code>runOutsideAngular</code>: ~290 → 5 bars in 5 s</p>'),
                b('line-2', 'text', 64, 270, 1150, sample='<p>Technique: before → after</p>'),
                b('line-3', 'text', 64, 340, 1150, required=False),
                b('line-4', 'text', 64, 410, 1150, required=False),
                b('monday', 'text', 64, 520, 1150, sample=f'<p>Start with the slow your users feel. {O.format("Measure it before you fix it.")}</p>'),
                b('question', 'text', 64, 600, 1150, fragment=True, sample='<p>Which one would you try at work?</p>')]),
    'exercise-start': dict(
        what='First slide of exercise 1: path, npm install, npm start, what the exercise is for, the running app on the right.',
        words=55, exercise=True,
        blocks=[b('title', 'text', 64, 96, 1150, sample='<h2>Exercise 1 - Getting started</h2>'),
                b('steps', 'text', 64, 160, 540, fonts={'0.85em'}, sample=STEPS('Open <code>labs/&lt;course&gt;/exercise-1</code>', 'Run <code>npm install</code>, then <code>npm start</code>')),
                b('image-2', 'image', 64, None, 380, required=False),
                b('note', 'text', 64, None, 540, fonts={'0.85em'}, required=False, sample=EX('What this exercise is for, in one line.')),
                b('image-1', 'image', 630, 160, 630, sample='images/app-step-1.jpg')]),
    'exercise-step': dict(
        what='One step of an exercise with nothing to show on the right: 1-4 numbered instructions, then an optional callout 48px below: a trap ("Trap: …") or what they should see ("You should see: …").',
        words=60, exercise=True,
        blocks=[EX_TITLE('Exercise 2 - Measure before'),
                b('steps', 'text', 64, 160, 1150, fonts={'0.85em'}, sample=STEPS(f'Open DevTools, <strong>Profiler</strong>, press <strong>Record</strong>', 'Write the number down')),
                b('callout', 'text', 64, None, 1150, fonts={'0.85em'}, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong and what you see.'))]),
    'exercise-step-code': dict(
        what='One step of an exercise: short instructions on the left, the code to write on the right.',
        words=50, exercise=True, code_lines=8,
        blocks=[EX_TITLE('Exercise 2 - Defer the map'),
                b('steps', 'text', 64, 160, 540, fonts={'0.85em'}, sample=STEPS('In <code>home.component.ts</code>, wrap <code>&lt;leaflet&gt;</code> in <code>@defer (on idle)</code>')),
                b('code-1', 'code', 630, 160, 630, sample='@defer (on idle) {\n  <leaflet/>\n}'),
                b('callout', 'text', 64, None, 540, fonts={'0.85em'}, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong.'))]),
    'exercise-step-image': dict(
        what='One step of an exercise: short instructions on the left, a screenshot of what they should see on the right.',
        words=45, exercise=True,
        blocks=[EX_TITLE('Exercise 2 - Watch the chunks load'),
                b('steps', 'text', 64, 160, 540, fonts={'0.85em'}, sample=STEPS('DevTools, <strong>Network</strong>, filter <strong>JS</strong>, reload')),
                b('image-1', 'image', 630, 160, 630, sample='images/devtools-network-chunks.jpg'),
                b('callout', 'text', 64, None, 540, fonts={'0.85em'}, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong.'))]),
    'exercise-result': dict(
        what='What the exercise measured: one or two big results, one line on why, 48px below.',
        words=25, exercise=True,
        blocks=[EX_TITLE('Exercise 2 - What we measured'),
                b('result-1', 'text', 64, 180, 1150, fragment=None, sample=RESULT('5 s of mouse moves: ~290 bars')),
                b('result-2', 'text', 64, 280, 1150, fragment=True, required=False, sample=RESULT('1 bar = the whole app')),
                b('why', 'text', 64, None, 1150, fragment=None, fonts={'0.85em'}, required=False, sample=EX('Why, in one line.'))]),
}

# Notes are for delivery. These phrases are authoring history and fail the check.
NOTES_RESIDUE = re.compile(r'cut from the slide|not on the slide any ?more|so it fits|older notes|was moved|moved (here|to the notes)|previous version|we changed', re.I)
MIN_CODE_PX, ORANGE_MAX, VISIBLE_MAX = 22, 2, 50

def words_of(fragment_html):
    text = html.unescape(re.sub(r'<[^>]+>', ' ', fragment_html))
    return [w for w in text.split() if re.search(r'\w', w)]

BLOCK = re.compile(r'<div class="(block[^"]*)" data-type="(\w+)" data-name="([^"]+)"([^>]*)style="([^"]*)">(.*?)\n  </div>', re.S)

def parse(path):
    src = path.read_text()
    sec = re.search(r'<section([^>]*)>', src)
    m = re.search(r'data-template="([^"]+)"', sec.group(1)) if sec else None
    notes = re.search(r'<aside class="notes">(.*?)</aside>', src, re.S)
    body = re.sub(r'<aside.*?</aside>', '', src, flags=re.S)
    blocks = {}
    for cls, kind, name, attrs, style, inner in BLOCK.findall(body):
        geo = {k: float(v) for k, v in re.findall(r'(left|top|width):(-?[\d.]+)px', style)}
        blocks[name] = dict(kind=kind, fragment='fragment' in cls.split(), geo=geo, inner=inner, style=style, attrs=attrs)
    return dict(template=m and m.group(1), blocks=blocks, notes=notes and notes.group(1).strip(),
                body=body, nblocks=len(re.findall(r'class="block[ "]', body)))

def check(path):
    s, problems = parse(path), []
    add = problems.append
    if re.search(r'<table|data-type="table"', s['body']):
        add('has a table')
    t = TYPES.get(s['template'])
    if not t:
        return problems + [f'data-template="{s["template"]}" is not a slide type' if s['template'] else 'no data-template']
    spec = {x['name']: x for x in t['blocks']}
    if s['nblocks'] != len(s['blocks']):
        add('blocks the checker cannot read (nested or unusual markup)')
    for name, blk in s['blocks'].items():
        x = spec.get(name)
        if not x:
            add(f'block "{name}" is not part of {s["template"]} (allowed: {", ".join(spec)})'); continue
        if blk['kind'] != x['kind']:
            add(f'block "{name}" is {blk["kind"]}, should be {x["kind"]}')
        for k in ('left', 'top', 'width'):
            if x[k] is not None and abs(blk['geo'].get(k, -1) - x[k]) > 1:
                add(f'block "{name}" {k} is {blk["geo"].get(k)}, template says {x[k]}')
        if x['fragment'] is not None and blk['fragment'] != x['fragment']:
            add(f'block "{name}" must {"" if x["fragment"] else "not "}be a fragment')
        if blk['kind'] == 'text':
            fonts = set(re.findall(r'font-size:\s*([\d.]+em)', blk['inner']))
            if fonts - x['fonts']:
                add(f'block "{name}" uses font-size {", ".join(sorted(fonts - x["fonts"]))}; allowed: {", ".join(sorted(x["fonts"])) or "none"}')
        if x.get('corner'):
            right, bottom, side = x['corner']
            g, h = blk['geo'], re.search(r'height:([\d.]+)px', blk['style'])
            hh = float(h.group(1)) if h else 0
            if abs(g.get('left', 0) + g.get('width', 0) - right) > 2 or abs(g.get('top', 0) + hh - bottom) > 2:
                add(f'block "{name}" must have its bottom-right corner at {right},{bottom}')
            if abs(max(g.get('width', 0), hh) - side) > 2:
                add(f'block "{name}" longest side must be {side}px')
        if blk['kind'] == 'image':
            src = re.search(r'<img src="([^"]+)"', blk['inner'])
            h = re.search(r'height:([\d.]+)px', blk['style'])
            img = src and path.parent / src.group(1)
            if img and img.exists() and h and blk['geo'].get('width'):
                out = subprocess.run(['magick', 'identify', '-format', '%w %h', f'{img}[0]'], capture_output=True, text=True).stdout.split()
                if len(out) == 2 and abs(float(h.group(1)) - blk['geo']['width'] * int(out[1]) / int(out[0])) > 2:
                    add(f'block "{name}" height does not match the image ratio (letterboxed): set height to width × {out[1]}/{out[0]}')
        if blk['kind'] == 'code':
            code = re.search(r'<code([^>]*)>(.*?)</code>', blk['inner'], re.S)
            n = len(code.group(2).rstrip('\n').split('\n')) if code else 0
            if n > t.get('code_lines', 8):
                add(f'block "{name}" has {n} code lines (max {t.get("code_lines", 8)}); elide with // …')
            px = re.search(r'<pre[^>]*font-size:\s*([\d.]+)px', blk['inner'])
            if not px or float(px.group(1)) < MIN_CODE_PX:
                add(f'block "{name}" code font is {px.group(1) + "px" if px else "not set"}; at least {MIN_CODE_PX}px')
            ln = re.search(r'data-line-numbers(="([^"]*)")?', blk['inner'])
            if ln and not (ln.group(2) or '').strip():
                add(f'block "{name}" shows line numbers without highlighting any; drop data-line-numbers')
        if name.startswith('result-') and '<h2' in blk['inner'] and 'keep-case' not in blk['inner']:
            add(f'block "{name}" heading needs class="keep-case" so names and units keep their case')
        if re.search(r'<ol[^>]*\bstart=', blk['inner']):
            add(f'block "{name}" continues a numbered list from another slide; keep each list on one slide')
    for name, x in spec.items():
        if x['required'] and name not in s['blocks']:
            add(f'missing block "{name}"')
    n = sum(len(words_of(b['inner'])) for k, b in s['blocks'].items() if k != 'title' and b['kind'] == 'text')
    if n > t['words']:
        add(f'{n} words (max {t["words"]} for {s["template"]}, title not counted)')
    if t.get('line_words'):
        for k, blk in s['blocks'].items():
            if k.startswith('line-') and len(words_of(blk['inner'])) > t['line_words']:
                add(f'block "{k}" has more than {t["line_words"]} words')
    orange = [m for k, b in s['blocks'].items() if k != 'title' and b['kind'] == 'text'
              for m in re.findall(r'color:\s*#ff8c00[^>]*>([^<]*)', b['inner'], re.I) if not m.strip().lower().startswith('trap')]
    if len(orange) > ORANGE_MAX:
        add(f'{len(orange)} orange spans (max {ORANGE_MAX} plus "Trap:"); paths and names go in white <code>, UI labels in <strong>')
    if s['notes'] and NOTES_RESIDUE.search(s['notes']):
        add(f'notes contain authoring history ("{NOTES_RESIDUE.search(s["notes"]).group(0)}"); notes are for delivery only')
    title = ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', s['blocks'].get('title', {}).get('inner', ''))).split())
    if t.get('exercise') and not re.match(r'Exercise \d+ - \S', title):
        add('exercise title must read "Exercise N - <step>"')
    if t.get('notes', True) and not s['notes']:
        add('no speaker notes')
    elif s['notes'] and '\n\n' not in s['notes'] and t.get('notes', True):
        add('notes need a short cue, a blank line, then the talk script')
    return problems

def write_templates(out):
    out.mkdir(parents=True, exist_ok=True)
    for name, t in TYPES.items():
        rows = [f'<section data-template="{name}">']
        for z, x in enumerate(b for b in t['blocks'] if b['required'] or b['sample']):
            cls = 'block fragment' if x['fragment'] else 'block'
            left, top, width = x['left'] or 640, x['top'] or 480, x['width'] or 602
            if x.get('corner'):
                left, top, width = x['corner'][0] - x['corner'][2], x['corner'][1] - x['corner'][2], x['corner'][2]
            if x['kind'] == 'text':
                rows += [f'  <div class="{cls}" data-type="text" data-name="{x["name"]}" style="left:{left}px;top:{top}px;width:{width}px;height:auto;z-index:{10 + z};text-align:left">',
                         f'    {x["sample"]}', '  </div>']
            elif x['kind'] == 'code':
                rows += [f'  <div class="{cls}" data-type="code" data-name="{x["name"]}" data-theme="dark" data-auto-height style="left:{left}px;top:{top}px;width:{width}px;height:auto;z-index:{10 + z}">',
                         f'    <pre style="font-size:{MIN_CODE_PX}px;line-height:30px"><code class="language-typescript">{html.escape(x["sample"], quote=False)}\n</code></pre>', '  </div>']
            else:
                rows += [f'  <div class="{cls}" data-type="image" data-name="{x["name"]}" data-keep-ratio style="left:{left}px;top:{top}px;width:{width}px;height:{width if x.get('corner') else 338}px;z-index:{10 + z}">',
                         f'    <img src="{x["sample"]}" alt="">', '  </div>']
        if t.get('notes', True):
            rows.append('  <aside class="notes">Short cue: what to click, the number to watch, the trap.\n\nTalk script in the instructor\'s voice. Name the demo route. Ask the room something concrete.</aside>')
        rows.append('</section>')
        (out / f'{name}.html').write_text('\n'.join(rows) + '\n')
    print(f'wrote {len(TYPES)} templates to {out}')

def describe():
    print('| Type | Use it for | Blocks (data-name, * = optional) | Max words |')
    print('|---|---|---|---|')
    for name, t in TYPES.items():
        blocks = ', '.join(f'`{x["name"]}`' + ('' if x['required'] else '*') + (' (click)' if x['fragment'] else '') for x in t['blocks'])
        extra = f', {t["code_lines"]} code lines' if 'code_lines' in t else ''
        extra += f', {t["line_words"]} per line' if 'line_words' in t else ''
        print(f'| `{name}` | {t["what"]} | {blocks} | {t["words"]}{extra} |')

def main(argv):
    if argv[:1] == ['--describe']:
        return describe()
    if argv[:1] == ['--write-templates']:
        return write_templates(Path(argv[1]))
    every = argv[:1] == ['--all']
    total = 0
    for course in map(Path, argv[every:]):
        deck = json.loads((course / 'slides/deck.json').read_text())
        visible = sum(1 for x in deck['slides'] if not x.get('hidden'))
        if visible > VISIBLE_MAX:
            total += 1; print(f'{course.name}: {visible} visible slides (max {VISIBLE_MAX})')
        if not (course / 'MEASURED.md').exists():
            total += 1; print(f'{course.name}: no MEASURED.md (every number on a slide needs its command and result there)')
        for slide in deck['slides']:
            if slide.get('hidden') and not every:
                continue
            for p in check(course / 'slides' / slide['file']):
                total += 1
                print(f'{course.name}/{slide["file"]}: {p}')
    print(f'{total} problem(s)')
    return 1 if total else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
