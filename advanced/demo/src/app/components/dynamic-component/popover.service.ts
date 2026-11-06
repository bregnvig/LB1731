import { Injectable } from '@angular/core';
import { SimplePlaygroundDetailsComponent } from './simple-playground-details/simple-playground-details.component';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  popoverComponent = SimplePlaygroundDetailsComponent;

}
