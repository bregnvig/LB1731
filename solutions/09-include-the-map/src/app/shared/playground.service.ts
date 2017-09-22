import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Playground } from './playground';

@Injectable()
export class PlaygroundService {

  private request$: Observable<Playground[]>;

  constructor(http: Http) {
    this.request$ = http.get('http://data.kk.dk/dataset/legepladser/resource/79d60521-5748-4287-a875-6d0e23fac31e/proxy')
      .map(response => response.json())
      .map(openData => openData.features)
      .map(openDataPlaygrounds => openDataPlaygrounds.filter(openDataPlayground => !!openDataPlayground.geometry))
      .map(openDataPlaygrounds => {
        return openDataPlaygrounds.map(openDataPlayground => {
          return <Playground> {
            'id': openDataPlayground.id,
            'name': openDataPlayground.properties.navn,
            'addressDescription': openDataPlayground.properties.adressebeskrivelse,
            'description': openDataPlayground.properties.beskrivelse,
            'position': {
              'lat': openDataPlayground.geometry.coordinates[0][1],
              'lng': openDataPlayground.geometry.coordinates[0][0]
            }
          }
        })
      })
      .catch((error: Response) => {
        console.error('Unable to fetch playgrounds', error.statusText);
        return Observable.of([]);
      })
  }

  public getPlaygrounds(): Observable<Playground[]> {
    return this.request$;
  }
}
