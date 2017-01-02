import { Coordinate } from './coordinate';

export interface Playground {
  readonly id: string;
  readonly name: string;
  readonly addressDescription?: string;
  readonly description?: string;
  readonly position: Coordinate;
}
