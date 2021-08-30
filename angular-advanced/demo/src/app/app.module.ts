import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDa from '@angular/common/locales/da';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

library.add(fas, far);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    // {
    //   provide: PLAYGROUND_SERVICE_URL,
    //   useValue: 'assets/aarhus.json',
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    registerLocaleData(localeDa);
    // Add multiple icons to the library
    library.addIconPacks(fas, far);
  }
}
