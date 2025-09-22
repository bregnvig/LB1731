import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { Person } from './../person';



@Component({
  selector: 'app-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  imports: [FormsModule, JsonPipe, NgbAlert]
})
export class TemplateDriverFormComponent {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  logValue(value: any) {
    console.log('Value', { ...this.model, ...value, });
  }
}
