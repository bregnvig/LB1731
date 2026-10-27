import { Playground } from './playground';

export function filterPlaygrounds(playgrounds: Playground[], query: string): Playground[] {
  const q = query.trim().toLowerCase();
  return playgrounds.filter(playground => playground.name.toLowerCase().includes(q));
}
