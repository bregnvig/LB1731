import { Deck } from '../deck/model';
import { renderSlide } from './render';

/**
 * The whole deck for reveal.js: intro slides side by side, then one vertical stack per course.
 * Moving sideways into a course always lands on its first slide. Left to itself, reveal.js resumes
 * where each window last left the stack, and the presenter's next view (which looks one step
 * ahead) would remember a different place than the window being driven.
 */
export function deckHtml(deck: Deck): string {
  return [
    ...deck.intro.map(s => renderSlide(s)),
    ...deck.courses.map(c => `<section data-course="${c.id}" data-start-indexv="0">${c.slides.map(s => renderSlide(s)).join('')}</section>`),
  ].join('');
}
