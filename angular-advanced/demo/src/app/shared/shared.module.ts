import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DistancePipe } from './pipe/distance.pipe';



@NgModule({
  declarations: [DistancePipe],
  imports: [
    CommonModule
  ],
  exports: [
    DistancePipe
  ]
})
export class SharedModule { }
