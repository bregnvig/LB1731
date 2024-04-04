import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicIoModule } from 'ng-dynamic-component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';

import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from './pipe';
import { SidebarListItemComponent } from './sidebar/sidebar-list-item/sidebar-list-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';

library.add(fas, far);

@NgModule(/* TODO(standalone-migration): clean up removed NgModule class manually. 
{
    declarations: [AppComponent],
    imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    DynamicIoModule,
    SidebarComponent,
    FooterComponent,
    DistancePipe,
    HumanizeDistancePipe,
    DefaultDescriptionPipe,
    SidebarListItemComponent,
],
    providers: [],
    bootstrap: [AppComponent]
} */)
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIconPacks(fas, far);
  }
}
