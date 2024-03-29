import { Injectable, Signal, computed, signal } from "@angular/core";
import { first } from "rxjs";
import { Playground } from "./model/playground";
import { PlaygroundService } from "./service";

export type PlaygroundState = {
  playgrounds: Playground[];
  id?: string;
};

const initialState: PlaygroundState = {
  playgrounds: []
};

@Injectable()
export class PlaygroundStore {

  private _state = signal(initialState);

  constructor(private service: PlaygroundService) { }

  get state(): Signal<PlaygroundState> {
    return this._state;
  }

  // This would be the actions and also effects
  loadPlaygrounds(): void {
    this.service.list().pipe(
      first(),
    ).subscribe(playgrounds => this.setState(() => ({ playgrounds })));
  }

  updatePlayground(playground: Partial<Playground>): void {
    const id = this.state().id;
    id && this.service.update(id, playground).pipe(
      first()
    ).subscribe(() => this.loadPlaygrounds());
  }

  selectedId(id: string) {
    this._state.update(state => ({
      ...state,
      id
    }));
  }

  // Reducer
  setState<K extends keyof PlaygroundState, E extends Partial<Pick<PlaygroundState, K>>>(
    fn: (state: PlaygroundState) => E
  ): void {
    const state = fn(this.state());
    this._state.set(({ ...this.state(), ...state }));
  }

  // Common selector you could consider this being private
  select<T>(selector: (state: PlaygroundState) => T): Signal<T> {
    return computed(() => selector(this._state()));
  }

  // This would be the facade
  get playgrounds(): Signal<Playground[]> {
    return this.select(state => state.playgrounds);
  }

  get playground(): Signal<Playground | undefined> {
    return this.select(state => state.playgrounds.find(p => p.id === state.id));
  }
}