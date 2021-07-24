import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ComponentsComponent } from './components.component';
import { ContentProjectionComponent } from './content-projection/content-projection.component';
import { AfterViewInitComponent } from './life-cycle/after-view-init/after-view-init.component';
import { LifeCycleComponent } from './life-cycle/life-cycle.component';
import { OnChangeDisplayListComponent } from './life-cycle/on-changes/on-change-display-list/on-change-display-list.component';
import { OnChangesComponent } from './life-cycle/on-changes/on-changes.component';
import { OnDestroyRandomComponent } from './life-cycle/on-destroy/on-destroy-random/on-destroy-random.component';
import { OnDestroyComponent } from './life-cycle/on-destroy/on-destroy.component';
import { StopWatchComponent } from './stop-watch/stop-watch.component';
import { ViewChildComponent } from './view-child/view-child.component';
import { ViewChildrenComponent } from './view-children/view-children.component';
import { PlaygroundListItemComponent } from './content-projection/playground-list-item/playground-list-item.component';


@NgModule({
  declarations: [
    ComponentsComponent,
    LifeCycleComponent,
    OnChangesComponent,
    OnDestroyComponent,
    OnChangeDisplayListComponent,
    OnDestroyRandomComponent,
    AfterViewInitComponent,
    ViewChildComponent,
    StopWatchComponent,
    ViewChildrenComponent,
    ContentProjectionComponent,
    PlaygroundListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ComponentsComponent,
        children: [
          {
            path: 'life-cycle',
            component: LifeCycleComponent
          },
          {
            path: 'content-projection',
            component: ContentProjectionComponent,
          },
          {
            path: 'view-child',
            component: ViewChildComponent,
          },
          {
            path: 'view-children',
            component: ViewChildrenComponent,
          },
          {
            path: '**',
            redirectTo: 'life-cycle'
          },
        ]
      }
    ])
  ]
})
export class ComponentsModule { }
