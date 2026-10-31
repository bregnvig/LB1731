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

O = '<span class="accent">{}</span>'
C = '<code>{}</code>'

def b(name, kind, left, top, width, *, fragment=False, required=True, sample='', h1=False, height=None, corner=None):
    """One block of a slide type. top=None: any top. fragment=None: either."""
    return dict(name=name, kind=kind, left=left, top=top, width=width, fragment=fragment, required=required,
                sample=sample, height=height, corner=corner)

THEORY_TITLE = lambda text: b('title', 'text', 64, 96, 1150, sample=f'<h2>{text}</h2>')
EX_TITLE = lambda text: b('title', 'text', 64, 96, 1150, sample=f'<h2>{text}</h2>')
EX = lambda s: f'<p>{s}</p>'
STAT = lambda before, after, label: f'<p class="stat">{before} → <span class="accent">{after}</span></p>\n<p>{label}</p>'
ITEMS = lambda tag, *items: f'<{tag}>\n' + '\n'.join(f'<li class="fragment">{i}</li>' for i in items) + f'\n</{tag}>'
STEPS = lambda *items: '<ol>\n' + '\n'.join(f'<li>{i}</li>' for i in items) + '\n</ol>'

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
        what='Three to five short items in one list, each appearing on a click, then an optional punchline. For kinds, steps and "In your app" homework.',
        words=45, item_words=8,
        blocks=[THEORY_TITLE('What does "slow" mean?'),
                b('items', 'text', 64, 200, 1150, sample=ITEMS('ul', 'Slow to respond', 'Slow to start', 'Slower over time')),
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
        what='One or two measured results as big numbers, side by side: the before in white, the after in accent, a short label under each. Then one line on why.',
        words=30, stats=True,
        blocks=[THEORY_TITLE('What we measured'),
                b('result-1', 'text', 64, 260, 560, sample=STAT('~300', '5', 'bars in 5 s of mouse moves')),
                b('result-2', 'text', 656, 260, 560, fragment=True, required=False, sample=STAT('229', '6 ms', 'change detection in those 5 s')),
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
                b('steps', 'text', 64, 160, 540, sample=STEPS('Open <code>labs/&lt;course&gt;/exercise-1</code>', 'Run <code>npm install</code>, then <code>npm start</code>')),
                b('image-2', 'image', 64, None, 380, required=False),
                b('note', 'text', 64, None, 540, required=False, sample=EX('What this exercise is for, in one line.')),
                b('image-1', 'image', 630, 160, 630, sample='images/app-step-1.jpg')]),
    'exercise-step': dict(
        what='One step of an exercise with nothing to show on the right: 1-4 numbered instructions, then an optional callout 48px below: a trap ("Trap: …") or what they should see ("You should see: …").',
        words=60, exercise=True,
        blocks=[EX_TITLE('Exercise 2 - Measure before'),
                b('steps', 'text', 64, 160, 1150, sample=STEPS(f'Open DevTools, <strong>Profiler</strong>, press <strong>Record</strong>', 'Write the number down')),
                b('callout', 'text', 64, None, 1150, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong and what you see.'))]),
    'exercise-step-code': dict(
        what='One step of an exercise: short instructions on the left, the code to write on the right.',
        words=50, exercise=True, code_lines=8,
        blocks=[EX_TITLE('Exercise 2 - Defer the map'),
                b('steps', 'text', 64, 160, 540, sample=STEPS('In <code>home.component.ts</code>, wrap <code>&lt;leaflet&gt;</code> in <code>@defer (on idle)</code>')),
                b('code-1', 'code', 630, 160, 630, sample='@defer (on idle) {\n  <leaflet/>\n}'),
                b('callout', 'text', 64, None, 540, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong.'))]),
    'exercise-step-image': dict(
        what='One step of an exercise: short instructions on the left, a screenshot of what they should see on the right.',
        words=45, exercise=True,
        blocks=[EX_TITLE('Exercise 2 - Watch the chunks load'),
                b('steps', 'text', 64, 160, 540, sample=STEPS('DevTools, <strong>Network</strong>, filter <strong>JS</strong>, reload')),
                b('image-1', 'image', 630, 160, 630, sample='images/devtools-network-chunks.jpg'),
                b('callout', 'text', 64, None, 540, required=False, sample=EX(f'{O.format("Trap:")} what goes wrong.'))]),
    'exercise-result': dict(
        what='Debrief after an exercise: one or two measured results as big numbers, the before in white, the after in accent, a short label under each. Then one line on why.',
        words=30, exercise=True, stats=True,
        blocks=[EX_TITLE('Exercise 2 - What we measured'),
                b('result-1', 'text', 64, 260, 560, fragment=None, sample=STAT('~300', '5', 'bars in 5 s of mouse moves')),
                b('result-2', 'text', 656, 260, 560, fragment=True, required=False, sample=STAT('229', '6 ms', 'change detection in those 5 s')),
                b('why', 'text', 64, None, 1150, fragment=None, required=False, sample='<p>Why, in one line.</p>')]),
}

STEP_TYPES = {'exercise-start', 'exercise-step', 'exercise-step-code', 'exercise-step-image'}

# Notes are for delivery. These phrases are authoring history and fail the check.
NOTES_RESIDUE = re.compile(r'cut from the slide|not on the slide any ?more|so it fits|older notes|was moved|moved (here|to the notes)|previous version|we changed', re.I)
# Slide text stays on the current step. The house opener is the one allowed reference to another exercise.
OPENER = 'Not happy with the result of the previous exercise?'
OTHER_LAB = re.compile(r'\b(labs?|exercises?|øvelse[rn]?)\s+\d+|\b(next|previous|later|earlier|another) (lab|exercise)\b', re.I)
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
        if blk['kind'] == 'text' and name != 'title':
            inline = sorted(set(re.findall(r'(font-size|line-height|color)\s*:', blk['inner'])))
            if inline:
                add(f'block "{name}" sets {", ".join(inline)} inline; use the type scale: class="stat", class="accent", plain text is body')
            unknown = set(c for cl in re.findall(r'class="([^"]*)"', blk['inner']) for c in cl.split()) - {'stat', 'accent', 'fragment'} - {c for c in re.findall(r'class="(language-[\w-]+)"', blk['inner'])}
            if unknown:
                add(f'block "{name}" uses class {", ".join(sorted(unknown))}; the type scale has stat and accent')
            if t.get('stats') and name.startswith('result-'):
                st = re.findall(r'<p class="stat">(.*?)</p>', blk['inner'], re.S)
                if len(st) != 1 or 'class="accent"' not in st[0]:
                    add(f'block "{name}" needs one <p class="stat">before → <span class="accent">after</span></p> and a label under it')
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
            if re.search(r'<pre[^>]*(font-size|line-height)', blk['inner']):
                add(f'block "{name}" sets the code size inline; the theme sets code to {MIN_CODE_PX}px')
            ln = re.search(r'data-line-numbers(="([^"]*)")?', blk['inner'])
            if ln and not (ln.group(2) or '').strip():
                add(f'block "{name}" shows line numbers without highlighting any; drop data-line-numbers')
        if re.search(r'<ol[^>]*\bstart=', blk['inner']):
            add(f'block "{name}" continues a numbered list from another slide; keep each list on one slide')
    for name, x in spec.items():
        if x['required'] and name not in s['blocks']:
            add(f'missing block "{name}"')
    n = sum(len(words_of(b['inner'])) for k, b in s['blocks'].items() if k != 'title' and b['kind'] == 'text')
    if n > t['words']:
        add(f'{n} words (max {t["words"]} for {s["template"]}, title not counted)')
    if t.get('item_words') and 'items' in s['blocks']:
        lis = re.findall(r'<li([^>]*)>(.*?)</li>', s['blocks']['items']['inner'], re.S)
        if not 3 <= len(lis) <= 5:
            add(f'block "items" has {len(lis)} items (3 to 5)')
        for attrs, li in lis:
            if 'fragment' not in attrs:
                add('every item in "items" appears on a click: <li class="fragment">')
            if len(words_of(li)) > t['item_words']:
                add(f'item "{" ".join(words_of(li))[:30]}…" has more than {t["item_words"]} words')
    orange = [m for k, b in s['blocks'].items() if k != 'title' and b['kind'] == 'text'
              for m in re.findall(r'class="[^"]*\baccent\b[^"]*"[^>]*>([^<]*)', b['inner']) if not m.strip().lower().startswith('trap')]
    if len(orange) > ORANGE_MAX:
        add(f'{len(orange)} accents (max {ORANGE_MAX} plus "Trap:"); paths and names go in white <code>, UI labels in <strong>')
    for k, blk in s['blocks'].items():
        if k == 'title' or blk['kind'] != 'text':
            continue
        text = ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', blk['inner'])).split()).replace(OPENER, '')
        if (ref := OTHER_LAB.search(text)):
            add(f'block "{k}" points at another lab ("{ref.group(0)}"); say it in the notes, not on the slide')
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
                         f'    <pre><code class="language-typescript">{html.escape(x["sample"], quote=False)}\n</code></pre>', '  </div>']
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
        extra += f', {t["item_words"]} per item' if 'item_words' in t else ''
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
        # Groups do an exercise on their own, outside the room: its step slides are one unbroken run with nothing
        # to present, the last one sends them back, and the results (debrief) come after the run.
        shown = [x['file'] for x in deck['slides'] if not x.get('hidden')]
        parsed = [parse(course / 'slides' / f) for f in shown]
        titles = [' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', p['blocks'].get('title', {}).get('inner', ''))).split()) for p in parsed]
        ex = [int(m.group(1)) if (m := re.match(r'Exercise (\d+) - ', t)) else None for t in titles]
        is_step = [p['template'] in STEP_TYPES for p in parsed]
        for n in sorted({e for e in ex if e}):
            steps = [i for i in range(len(shown)) if ex[i] == n and is_step[i]]
            if not steps:
                continue
            for i in range(steps[0], steps[-1] + 1):
                if not (ex[i] == n and is_step[i]):
                    total += 1; print(f'{course.name}/{shown[i]}: breaks up exercise {n}; groups work through it alone, so put this before the exercise or in the debrief after it')
            for i in steps:
                if any(b['fragment'] for b in parsed[i]['blocks'].values()):
                    total += 1; print(f'{course.name}/{shown[i]}: exercise step with a click reveal; nobody presents it, show everything')
            if not re.search(r'come back', parsed[steps[-1]]['body'], re.I):
                total += 1; print(f'{course.name}/{shown[steps[-1]]}: last step of exercise {n} must tell the group to come back to the room')
            for i in range(steps[0]):
                if ex[i] == n and parsed[i]['template'] == 'exercise-result':
                    total += 1; print(f'{course.name}/{shown[i]}: result of exercise {n} before its steps; results go in the debrief after the run')
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
