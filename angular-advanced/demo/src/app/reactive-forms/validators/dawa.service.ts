import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval, Observable } from "rxjs";
import { first, map, switchMapTo } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DawaService {

  constructor(private http: HttpClient) {
  }

  getCityName(zipCode: string): Observable<string> {
    return interval(500).pipe(
      first(),
      switchMapTo(this.http.get<any>(`https://api.dataforsyningen.dk/postnumre/${zipCode}`)),
      map(response => response.navn),
    );
  }
}