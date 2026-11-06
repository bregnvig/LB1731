import { Service } from "@angular/core";
import { MOCK_PLAYGROUNDS } from "./mock-playgrounds";
import { Playground } from "./playground";

@Service()
export class PlaygroundService {
  getPlaygrounds(): Playground[] {
    return MOCK_PLAYGROUNDS;
  }
}