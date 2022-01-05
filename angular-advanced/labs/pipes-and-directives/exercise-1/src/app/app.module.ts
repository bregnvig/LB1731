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
import { AppComponent } from './app.component';
import { EditPlaygroundControlComponent } from './edit-playground-control/edit-playground-control.component';
import { EditPlaygroundModalComponent } from './edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from './footer/footer.component';
import { LeafletModule } from './leaflet';
import { LoginComponent } from './login/login.component';
import { DefaultDescriptionPipe, HumanizeDistancePipe } from './pipe';
import { SidebarComponent } from './sidebar/sidebar.component';

library.add(fas, far);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    HumanizeDistancePipe,
    DefaultDescriptionPipe,
    EditPlaygroundModalComponent,
    EditPlaygroundControlComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    LeafletModule,
    FontAwesomeModule,
    DynamicIoModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIconPacks(fas, far);
  }
}
