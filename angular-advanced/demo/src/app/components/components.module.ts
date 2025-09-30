import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicIoModule } from 'ng-dynamic-component';
import { SharedModule } from '../shared/shared.module';
import { ChangeDetectionComponent } from './change-detection/change-detection.component';
import { InputPropertyOnPushByReferenceComponent } from './change-detection/input-property/input-property-on-push-by-reference.component';
import { InputPropertyOnPushSimpleTypeComponent } from './change-detection/input-property/input-property-on-push-simple-type.component';
import { InputPropertyComponent } from './change-detection/input-property/input-property.component';
import { ObservableEventsDefaultComponent } from './change-detection/observable-events/observable-events-default.component';
import { ObservableEventsComponent } from './change-detection/observable-events/observable-events.component';
import { WrappedInsideOnPushComponent } from './change-detection/observable-events/wrapped-inside-onpush.component';
import { ComponentsComponent } from './components.component';
import { ContentProjectionComponent } from './content-projection/content-projection.component';
import { PlaygroundListItemSingleSlotComponent } from './content-projection/playground-list-item/playground-list-item-single-slot.component';
import { PlaygroundListItemComponent } from './content-projection/playground-list-item/playground-list-item.component';
import { SingleSlotContentProjectionComponent } from './content-projection/single-slot-content-projection.component';
import { DynamicComponentComponent } from './dynamic-component/dynamic-component.component';
import { DynamicViewContainerRefComponentComponent } from './dynamic-component/dynamic-view-container-ref-component.component';
import { FancyPlaygroundDetailsComponent } from './dynamic-component/fancy-playground-details/fancy-playground-details.component';
import { NgDynamicComponentComponent } from './dynamic-component/ng-dynamic-component.component';
import { SimplePlaygroundDetailsComponent } from './dynamic-component/simple-playground-details/simple-playground-details.component';
import { AfterViewInitComponent } from './life-cycle/after-view-init/after-view-init.component';
import { LifeCycleComponent } from './life-cycle/life-cycle.component';
import { OnChangeDisplayListComponent } from './life-cycle/on-changes/on-change-display-list/on-change-display-list.component';
import { OnChangesComponent } from './life-cycle/on-changes/on-changes.component';
import { OnDestroyRandomComponent } from './life-cycle/on-destroy/on-destroy-random/on-destroy-random.component';
import { OnDestroyComponent } from './life-cycle/on-destroy/on-destroy.component';
import { StopWatchComponent } from './stop-watch/stop-watch.component';
import { CommonFilterListComponent } from './template-outlet/common-filter-list/common-filter-list.component';
import { CommonListFilterFilterFnComponent } from './template-outlet/common-list-filter-filter-fn/common-list-filter-filter-fn.component';
import { NonTemplateOutletComponent } from './template-outlet/non-template-outlet.component';
import { TemplateOutletComponent } from './template-outlet/template-outlet.component';
import { ViewChildComponent } from './view-child/view-child.component';
import { ViewChildrenComponent } from './view-children/view-children.component';


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
    PlaygroundListItemComponent,
    DynamicComponentComponent,
    SimplePlaygroundDetailsComponent,
    FancyPlaygroundDetailsComponent,
    NgDynamicComponentComponent,
    TemplateOutletComponent,
    CommonFilterListComponent,
    NonTemplateOutletComponent,
    ChangeDetectionComponent,
    InputPropertyComponent,
    InputPropertyOnPushByReferenceComponent,
    InputPropertyOnPushSimpleTypeComponent,
    CommonListFilterFilterFnComponent,
    ObservableEventsComponent,
    SingleSlotContentProjectionComponent,
    PlaygroundListItemSingleSlotComponent,
    WrappedInsideOnPushComponent,
    ObservableEventsDefaultComponent,
    StopWatchComponent,
    DynamicViewContainerRefComponentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    DynamicIoModule,
    FontAwesomeModule,
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
            path: 'single-slot-content-projection',
            component: SingleSlotContentProjectionComponent,
          },
          {
            path: 'multi-slot-content-projection',
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
            path: 'dynamic-component',
            component: DynamicComponentComponent,
          },
          {
            path: 'view-container',
            component: DynamicViewContainerRefComponentComponent,
          },
          {
            path: 'ng-dynamic-component',
            component: NgDynamicComponentComponent,
          },
          {
            path: 'non-template-outlet',
            component: NonTemplateOutletComponent,
          },
          {
            path: 'template-outlet',
            component: TemplateOutletComponent,
          },
          {
            path: 'change-detection',
            component: ChangeDetectionComponent,
          },
          {
            path: '**',
            redirectTo: 'life-cycle'
          },
        ]
      }
    ])
  ],
  // providers: [
  //   {
  //     provide: PopoverService,
  //     useClass: FancyPopoverService,
  //   }
  // ]
})
export class ComponentsModule { }
