import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { AsyncPipeComponent } from './async-pipe/async-pipe.component';
import { JsonComponent } from './json/json.component';
import { KeyValueComponent } from './key-value/key-value.component';
import { MyFirstImpureComponent } from './my-first-impure/my-first-impure.component';
import { MyFirstImpurePipe } from './my-first-impure/my-first-impure.pipe';
import { MyFirstComponent } from './my-first/my-first.component';
import { MyFirstPipe } from './my-first/my-first.pipe';
import { PipesComponent } from './pipes/pipes.component';



@NgModule({
  declarations: [
    PipesComponent,
    JsonComponent,
    KeyValueComponent,
    AsyncPipeComponent,
    MyFirstComponent,
    MyFirstPipe,
    MyFirstImpurePipe,
    MyFirstImpureComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PipesComponent,
        children: [
          {
            path: 'json',
            component: JsonComponent,
          },
          {
            path: 'keyvalue',
            component: KeyValueComponent,
          },
          {
            path: 'async',
            component: AsyncPipeComponent,
          },
          {
            path: 'my-first',
            component: MyFirstComponent,
          },
          {
            path: 'my-first-impure',
            component: MyFirstImpureComponent,
          },
          {
            path: '**',
            redirectTo: 'json'
          }
        ]
      }
    ])
  ]
})
export class PipesModule { }
