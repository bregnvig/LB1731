import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'loop-ng-if',
    templateUrl: './ng-if.component.html',
    styleUrls: ['./ng-if.component.scss'],
    standalone: false
})
export class NgIfComponent {

  blueControl = new FormControl<boolean>(false);
}
