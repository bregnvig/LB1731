import { Component, inject, input } from '@angular/core';
import { Animation, Block, Effect, Fragment } from '../../deck/model';
import { EditorStore } from '../editor.store';

const EFFECTS: { id: Effect; label: string }[] = [
  { id: 'fade-in', label: 'Fade in' }, { id: 'fade-out', label: 'Fade out' }, { id: 'scale-up', label: 'Scale up' },
  { id: 'scale-down', label: 'Scale down' }, { id: 'slide-up', label: 'Slide up' }, { id: 'slide-down', label: 'Slide down' },
];
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const num = (e: Event) => Number((e.target as HTMLInputElement).value);

/**
 * Plays a block's animation on the canvas: start state at once, then the transition to the end
 * state with the block's timing (the classes from deck.css), then back to how the editor shows it.
 */
function preview(name: string, a: Animation) {
  const el = document.querySelector<HTMLElement>(`app-canvas .editor-slide section > .block[data-name="${CSS.escape(name)}"]`);
  if (!el) return;
  el.style.transition = 'none';
  el.classList.remove('animate-in');
  el.classList.add('animate-start');
  void el.offsetWidth;
  el.style.transition = '';
  el.style.transitionDuration = `${a.duration}s`;
  el.style.transitionDelay = `${a.delay}s`;
  requestAnimationFrame(() => el.classList.replace('animate-start', 'animate-in'));
  setTimeout(() => {
    el.style.transition = 'none';
    el.classList.remove('animate-in', 'animate-start');
  }, (a.duration + a.delay) * 1000 + 700);
}

/** The Motion tab: the block's animation (when and how it appears) and fragment step. */
@Component({
  selector: 'app-motion-settings',
  template: `
    @let b = block();
    <div class="group">
      <label class="row"><span class="label">Animation</span>
        <input type="checkbox" class="sw" aria-label="Animation" [checked]="!!b.animation" (change)="store.setAnimation(b.name, $any($event.target).checked)"></label>
      @if (b.animation; as a) {
        <div class="row"><span>Starts</span><span class="seg">
          <button type="button" [class.on]="a.on == null" (click)="setAnimation({ on: null })">On entry</button>
          <button type="button" [class.on]="a.on != null" [disabled]="!triggers().length" (click)="setAnimation({ on: a.on ?? triggers()[0] })">On click</button></span></div>
        @if (a.on != null) {
          <label class="row"><span>Clicked block</span>
            <select class="field" aria-label="Clicked block" (change)="setAnimation({ on: $any($event.target).value })">
              @for (n of triggers(); track n) { <option [value]="n" [selected]="n === a.on">{{ n }}</option> }
            </select></label>
        }
        <label class="row"><span>Effect</span>
          <select class="field" aria-label="Effect" (change)="setAnimation({ effect: $any($event.target).value })">
            @for (e of effects; track e.id) { <option [value]="e.id" [selected]="e.id === a.effect">{{ e.label }}</option> }
          </select></label>
        <label class="row"><span>Duration (s)</span>
          <input type="number" class="field narrow" aria-label="Duration" min="0.1" max="5" step="0.1" [value]="a.duration" (change)="setAnimation({ duration: clamp(num($event), 0.1, 5) })"></label>
        <label class="row"><span>Delay (s)</span>
          <input type="number" class="field narrow" aria-label="Delay" min="0" max="10" step="0.1" [value]="a.delay" (change)="setAnimation({ delay: clamp(num($event), 0, 10) })"></label>
        <button type="button" class="btn wide" (click)="preview(b.name, a)">▶ Preview on canvas</button>
      }
    </div>
    <div class="group">
      <label class="row"><span class="label">Fragment</span>
        <input type="checkbox" class="sw" aria-label="Fragment" [checked]="!!b.fragment" (change)="store.setFragment(b.name, $any($event.target).checked)"></label>
      @if (b.fragment; as f) {
        <div class="row"><span>Style</span><span class="seg">
          <button type="button" [class.on]="f.style === ''" (click)="setFragment({ style: '' })">Fade in</button>
          <button type="button" [class.on]="f.style === 'fade-down'" (click)="setFragment({ style: 'fade-down' })">Fade down</button></span></div>
        <label class="row"><span>Step (empty: in order)</span>
          <input type="number" class="field narrow" aria-label="Fragment step" min="0" [value]="f.index ?? ''" (change)="setStep($any($event.target).value)"></label>
      }
      <p class="hint">A fragment appears on its own step when presenting; the editor always shows it.</p>
    </div>
  `,
})
export class MotionSettingsComponent {
  readonly store = inject(EditorStore);
  readonly block = input.required<Block>();
  readonly effects = EFFECTS;
  readonly clamp = clamp;
  readonly num = num;
  readonly preview = preview;
  readonly triggers = () => this.store.triggerOptions(this.block().name);

  setAnimation(patch: Partial<Animation>) {
    this.store.updateBlocks([this.block().name], b => (b.animation ? { ...b, animation: { ...b.animation, ...patch } } : b));
  }

  setFragment(patch: Partial<Fragment>) {
    this.store.updateBlocks([this.block().name], b => (b.fragment ? { ...b, fragment: { ...b.fragment, ...patch } } : b));
  }

  setStep(v: string) {
    this.setFragment({ index: v.trim() === '' ? null : Math.max(0, Math.round(Number(v))) });
  }
}
