import { Routes } from "@angular/router";
import { ChangeDetectionComponent } from "./change-detection/change-detection.component";
import { ComponentsComponent } from "./components.component";
import { ContentProjectionComponent } from "./content-projection/content-projection.component";
import { SingleSlotContentProjectionComponent } from "./content-projection/single-slot-content-projection.component";
import { DynamicComponentComponent } from "./dynamic-component/dynamic-component.component";
import { DynamicViewContainerRefComponentComponent } from "./dynamic-component/dynamic-view-container-ref-component.component";
import { NgDynamicComponentComponent } from "./dynamic-component/ng-dynamic-component.component";
import { LifeCycleComponent } from "./life-cycle/life-cycle.component";
import { NonTemplateOutletComponent } from "./template-outlet/non-template-outlet.component";
import { TemplateOutletComponent } from "./template-outlet/template-outlet.component";
import { ViewChildComponent } from "./view-child/view-child.component";
import { ViewChildrenComponent } from "./view-children/view-children.component";

export const ComponentsRoutes: Routes = [
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
];
