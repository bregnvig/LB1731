import { Component } from '@angular/core';

@Component({
    selector: 'loop-default-locale',
    template: `Default locale: {{now | date: 'shortDate'}}`,
    standalone: false
})
export class DefaultLocaleComponent {

  now = new Date();

}
