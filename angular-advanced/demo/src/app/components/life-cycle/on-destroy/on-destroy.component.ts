import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-on-destroy',
    templateUrl: './on-destroy.component.html',
    styleUrls: ['./on-destroy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OnDestroyComponent {

  show = true;

}
