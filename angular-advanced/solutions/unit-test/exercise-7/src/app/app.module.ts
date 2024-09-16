import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from './button/button.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LeafletModule } from './leaflet';
import { LoginComponent } from './login/login.component';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from './pipe';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({ declarations: [
        AppComponent,
        SidebarComponent,
        FooterComponent,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
        HomeComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ButtonModule,
        NgbModule,
        LeafletModule,
        LoginComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
