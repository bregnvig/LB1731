import { Coordinate } from "./coordinate";

export interface Playground {
  readonly id: string;
  name: string;
  description?: string;
  addressDescription?: string;
  readonly position: Coordinate;
}