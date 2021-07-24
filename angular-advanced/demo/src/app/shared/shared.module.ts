import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [DistancePipe],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    DistancePipe,
    FontAwesomeModule,
  ]
})
export class SharedModule { }
