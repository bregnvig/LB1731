import { Component } from '@angular/core';

// Only used inside one @defer block, so the build puts it in a chunk of its own.
@Component({
  selector: 'loop-prefetch-loaded',
  template: `<div class="alert alert-success fs-5 mb-0">Loaded at {{ loadedAt }} from <code class="text-reset fw-bold">{{ chunk }}</code></div>`,
})
export class PrefetchLoadedComponent {
  protected loadedAt = new Date().toLocaleTimeString();
  protected chunk = import.meta.url.split('/').pop();
}
