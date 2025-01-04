import { Component } from '@angular/core';
import { RotateFlyover2 } from '../rotate.directive';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-binding-attribute',
    templateUrl: './binding-attribute.component.html',
    styleUrls: ['./binding-attribute.component.css'],
    standalone: true,
    imports: [FormsModule, RotateFlyover2]
})
export class BindingAttributeComponent {

  angle: number = 0;
}
