import { Component } from '@angular/core';
import { BuiltinAttributeComponent } from './builtin-attribute.component';

type LigthState = 'red' | 'yellow' | 'green';

@Component({
  selector: 'loop-builtin-attribute-class-dot',
  templateUrl: './builtin-attribute-class-dot.component.html',
  styleUrls: ['./builtin-attribute.component.scss']
})
export class BuiltinAttributeClassDotComponent extends BuiltinAttributeComponent {
}
