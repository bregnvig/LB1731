import { Injectable, OnDestroy } from "@angular/core";
import { interval, map, startWith, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RandomService implements OnDestroy {

  no: number = 0;

  private subscription: Subscription | undefined;

  constructor() {
    this.subscription = interval(1000).pipe(
      startWith(undefined),
      map(() => Math.floor(Math.random() * 1000)),
    ).subscribe(no => this.no = no);
  }

  ngOnDestroy() {
    console.log(`Service is being destroyed`);
    this.subscription?.unsubscribe();
  }
}