import { Injectable, Signal, computed, signal } from "@angular/core";
import { Playground } from "./model/playground";
import { PlaygroundService } from "./service";
import { firstValueFrom } from "rxjs";

type PlaygroundState = {
  playgrounds: Playground[];
  id?: string;
};

const initialState: PlaygroundState = {
  playgrounds: []
};

@Injectable()
export class PlaygroundStore {
  private _state = signal<PlaygroundState>(initialState);

  constructor(private playgroundService: PlaygroundService) {
    this.playgroundService.list().subscribe(playgrounds => this.setPlaygrounds(playgrounds));
  }

  setId(id: string) {
    this.setState(() => ({ id }));
  }

  setPlaygrounds(playgrounds: Playground[]) {
    this.setState(() => ({ playgrounds }));
  }

  // optimistic update
  updatePlayground(id: string, playground: Playground) {
    const state = this._state();
    this.setState(state => ({ playgrounds: state.playgrounds.map(p => p.id === id ? playground : p) }));
    firstValueFrom(this.playgroundService.update(id, playground)).catch(() => this.setState(() => state));
  }

  get playgrounds(): Signal<Playground[]> {
    return this.select(state => state.playgrounds);
  }

  get playground(): Signal<Playground | undefined> {
    return computed(() => this.state().playgrounds.find(p => p.id === this.state().id));
  }

  get state(): Signal<PlaygroundState> {
    return this._state;
  }

  setState<K extends keyof PlaygroundState, E extends Partial<Pick<PlaygroundState, K>>>(
    fn: (state: PlaygroundState) => E
  ): void {
    const state = fn(this.state());
    this._state.set({ ...this.state(), ...state });
  }

  select<T>(selector: (state: PlaygroundState) => T): Signal<T> {
    return computed(() => selector(this.state()));
  }

}