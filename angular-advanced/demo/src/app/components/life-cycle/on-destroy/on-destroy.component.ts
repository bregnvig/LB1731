import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OnDestroyRandomComponent } from './on-destroy-random/on-destroy-random.component';

@Component({
    selector: 'loop-on-destroy',
    templateUrl: './on-destroy.component.html',
    styleUrls: ['./on-destroy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [OnDestroyRandomComponent]
})
export class OnDestroyComponent {

  show = true;

}
