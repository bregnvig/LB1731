import { Coordinate } from './coordinate';

export interface Playground {
  readonly id: string;
  name: string;
  addressDescription: string;
  description: string;
  position: Coordinate;
}
