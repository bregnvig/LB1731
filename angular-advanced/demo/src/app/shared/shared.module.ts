import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectAllDirective } from './directive/select-all.directive';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [DistancePipe, SelectAllDirective],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LeafletModule
  ],
  exports: [
    DistancePipe,
    SelectAllDirective,
    FontAwesomeModule,
    LeafletModule,
  ]
})
export class SharedModule { }
