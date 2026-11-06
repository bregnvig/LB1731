import { Injectable } from "@angular/core";
import { MOCK_PLAYGROUNDS } from "./mock-playgrounds";
import { Playground } from "./playground";

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  getPlaygrounds(): Playground[] {
    return MOCK_PLAYGROUNDS;
  }
}