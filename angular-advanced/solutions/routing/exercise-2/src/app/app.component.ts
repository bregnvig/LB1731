import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, merge, noop, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from './footer/footer.component';
import { Center, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { withLength } from './utils/rxjs-utils';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'loop-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet]
})
export class AppComponent {


}
