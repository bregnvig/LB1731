import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _count;

  public increment(): void {
    this._count += 1;
  }

  public get count(): number {
    return this._count;
  }
}
