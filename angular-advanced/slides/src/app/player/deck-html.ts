import { Deck } from '../deck/model';
import { renderSlide } from './render';

/** The whole deck for reveal.js: intro slides side by side, then one vertical stack per course. */
export function deckHtml(deck: Deck): string {
  return [
    ...deck.intro.map(s => renderSlide(s)),
    ...deck.courses.map(c => `<section data-course="${c.id}">${c.slides.map(s => renderSlide(s)).join('')}</section>`),
  ].join('');
}
