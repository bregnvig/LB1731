import { ElementRef, NgZone, inject } from '@angular/core';

/**
 * Demo plumbing, not part of the lesson. Call the returned function from a template binding:
 * Angular evaluates bindings exactly when it checks a view, so every call is one check.
 * It shows the count in the node's `.checks` element and flashes the node's card.
 */
export function checkCounter() {
  const host: HTMLElement = inject(ElementRef).nativeElement;
  const zone = inject(NgZone);
  let checks = 0;
  let pending = false;

  return () => {
    // Dev mode reads every binding twice per check, so count once until the flash has run
    if (!pending) {
      pending = true;
      checks++;
      // Straight to the DOM from outside Angular, so showing the count is not itself a reason for another check
      zone.runOutsideAngular(() => queueMicrotask(() => {
        pending = false;
        const card = host.querySelector(':scope > .node')!;
        card.querySelector('.checks')!.textContent = String(checks);
        card.animate({ backgroundColor: ['#ffd43b', '#ffffff'] }, { duration: 900, easing: 'ease-out' });
      }));
    }
    return '';
  };
}
