import { Injectable } from '@angular/core';
import { FancyPlaygroundDetailsComponent } from './fancy-playground-details/fancy-playground-details.component';

@Injectable()
export class FancyPopoverService {

  popoverComponent = FancyPlaygroundDetailsComponent;
}
