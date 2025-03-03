import { Component, LOCALE_ID } from '@angular/core';

@Component({
    selector: 'loop-da-locale',
    template: `Danish locale: {{now | date: 'shortDate'}}`,
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'da'
        }
    ],
    standalone: false
})
export class DaLocaleComponent {

  now = new Date();

}
