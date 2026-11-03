import { Service, signal } from '@angular/core';

@Service()
export class FavoritesService {

  private readonly _favoriteIds = signal<string[]>([]);
  readonly favoriteIds = this._favoriteIds.asReadonly();

  toggle(id: string): void {
    this._favoriteIds.update(ids => ids.includes(id) ? ids.filter(favoriteId => favoriteId !== id) : [...ids, id]);
  }

}
