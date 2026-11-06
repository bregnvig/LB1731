import { Component, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-da-locale',
    template: `Danish locale: {{now | date: 'shortDate'}}`,
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'da'
        }
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DaLocaleComponent {

  now = new Date();

}
