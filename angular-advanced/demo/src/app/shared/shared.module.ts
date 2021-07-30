import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [DistancePipe],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LeafletModule
  ],
  exports: [
    DistancePipe,
    FontAwesomeModule,
    LeafletModule,
  ]
})
export class SharedModule { }
