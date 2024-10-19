import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'loop-root',
  standalone: true,
  template: `
    <router-outlet/>
  `,
  imports: [RouterOutlet],
})
export class AppComponent {
}