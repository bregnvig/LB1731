import { Component } from '@angular/core';

@Component({
  selector: 'loop-about',
  template: `
    <section class="pb-2">
      <h4>Om appen</h4>
      <p class="mb-0">Find legepladser i nærheden. Listen er sorteret efter afstand til dig. Kort &copy; OpenStreetMap.</p>
    </section>
  `,
})
export class AboutComponent {
}
