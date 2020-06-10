import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _count;

   increment(): void {
    this._count += 1;
  }

   get count(): number {
    return this._count;
  }
}
