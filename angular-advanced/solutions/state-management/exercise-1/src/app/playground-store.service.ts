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

@Injectable({
  providedIn: 'root'
})
export class PlaygroundStore {

  _state = signal(initialState);

  constructor(private service: PlaygroundService) { }

  get state(): Signal<PlaygroundState> {
    return this._state;
  }

  // This would be the actions and also effects and reducer
  getPlaygrounds(): void {
    this.service.list().pipe(
      first(),
    ).subscribe(playgrounds => {
      this._state.update(state => ({
        ...state,
        playgrounds
      }));
    });
  }

  updatePlayground(playground: Partial<Playground>): void {
    const id = this.state().id;
    id && this.service.update(id, playground).pipe(
      first()
    ).subscribe(playground => this._state.update(state => ({
      ...state,
      playgrounds: state.playgrounds.map(p => p.id === id ? playground : p)
    })));
  }

  selectedId(id: string) {
    this._state.update(state => ({
      ...state,
      id
    }));
  }

  // Common selector you could consider being private
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