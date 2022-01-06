import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FocusEmptyDirective } from './directive/focus-empty.directive';
import { SelectAllDirective } from './directive/select-all.directive';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [
    DistancePipe,
    SelectAllDirective,
    FocusEmptyDirective,
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
    FontAwesomeModule,
    LeafletModule,
  ]
})
export class SharedModule { }
