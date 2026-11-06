import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExpandDirective } from './directive/expand.directive';
import { FocusEmptyDirective } from './directive/focus-empty.directive';
import { SelectAllDirective } from './directive/select-all.directive';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [
    DistancePipe,
    SelectAllDirective,
    FocusEmptyDirective,
    ExpandDirective,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LeafletModule
  ],
  exports: [
    DistancePipe,
    SelectAllDirective,
    FocusEmptyDirective,
    ExpandDirective,
    FontAwesomeModule,
    LeafletModule,
  ]
})
export class SharedModule { }
