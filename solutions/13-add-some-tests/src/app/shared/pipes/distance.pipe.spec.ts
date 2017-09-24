import { Coordinate } from './../coordinate';
import { LocationService } from './../location.service';
import { Subject } from 'rxjs';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DistancePipe } from './distance.pipe';

describe('Pipe: Distance', () => {
    let pipe: DistancePipe;
    let locationService: LocationService;
    const position = {
        lat: 55.72098055865299,
        lng: 12.528431156384602
    };
    
    const subject = new Subject<Coordinate>();
    const locationServiceFactory = () => {
        return {
            current: subject,
            getDistance: jasmine.createSpy('getDistanceSpy')
        };
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LocationService,
                    useFactory: locationServiceFactory
                }
            ]
        })
        locationService = TestBed.get(LocationService);
        pipe = new DistancePipe(locationService);
    });
    it(`should return Ukendt, when the position is not defined`, () => {
        expect(pipe.transform(position)).toEqual('Ukendt');
        expect(locationService.getDistance).not.toHaveBeenCalled();
    });

    it(`should call getDistance, when the position is defined`, () => {
        subject.next({
            lat: 55.72098055865299,
            lng: 12.528
        });
        pipe.transform(position);
        expect(pipe.transform(position)).not.toEqual('Ukendt');
        expect(locationService.getDistance).toHaveBeenCalled();
    });

});
