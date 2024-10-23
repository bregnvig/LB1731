import { IMAGE_CONFIG, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    NgOptimizedImage,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    registerLocaleData(localeDa);
    // Add multiple icons to the library
    library.addIconPacks(fas, far);
  }
}
