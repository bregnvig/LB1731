import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BuildInComponent, ChainingComponent, ImpurePipe, PhoneComponent, PhonePipe, PureComponent, PurePipe, TodayComponent } from './index';

import { HttpClientModule } from '@angular/common/http';
import { AsyncComponent } from './async/async.component';
import { routing } from './pipes.routing';

@NgModule({
  imports: [CommonModule, HttpClientModule, FormsModule, routing],
  declarations: [BuildInComponent, ChainingComponent, PhoneComponent, PureComponent, TodayComponent, PurePipe, ImpurePipe, PhonePipe, AsyncComponent]
})
export class PipesModule { }