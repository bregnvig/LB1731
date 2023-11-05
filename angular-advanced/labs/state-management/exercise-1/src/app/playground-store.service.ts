import { Injectable, Signal, signal } from "@angular/core";
import { Playground } from "./model/playground";

export type PlaygroundState = {
  playgrounds: Playground[];
  id?: string;
};

const initialState: PlaygroundState = {
  playgrounds: []
};

@Injectable()
export class PlaygroundStore {

}