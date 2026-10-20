import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-default-locale',
    template: `Default locale: {{now | date: 'shortDate'}}`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DefaultLocaleComponent {

  now = new Date();

}
