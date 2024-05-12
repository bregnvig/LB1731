import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, map, startWith, timer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RandomService implements OnDestroy {

  no: number = 0;

  private subscription: Subscription | undefined;

  constructor() {
    this.subscription = timer(0, 5000).pipe(
      startWith(undefined),
      map(() => Math.floor(Math.random() * 1000)),
    ).subscribe(no => this.no = no);
  }

  ngOnDestroy() {
    console.log(`Service is being destroyed`);
    this.subscription?.unsubscribe();
  }
}