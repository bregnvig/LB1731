import type { RevealApi } from 'reveal.js';
import type { BlockAnimationsPlugin } from '../player/block-animations';

// Keeps every open presentation window (and the presenter's iframes) on the same slide,
// fragment and clicked animations. Windows talk over a BroadcastChannel; a new window says
// hello, announces where it is, and the others answer with where they are. Announcements and
// answers carry when the window opened, and a window follows only windows older than itself: two
// windows opening together may tell each other their start positions, but the oldest one wins.
// The presenter's next-slide view never leads, so it follows the oldest window it hears from.

export interface Bus {
  postMessage(data: unknown): void;
  addEventListener(type: 'message', fn: (e: { data: unknown }) => void): void;
  close(): void;
}

interface State { indexh: number; indexv: number; indexf?: number }
/** `born` (when the sending window opened) marks announcements and answers to hello; moves have none. */
type Message = { type: 'hello'; from: string } | { type: 'state'; from: string; state: State; clicks: string[]; born?: number };

export function connectSync(
  reveal: RevealApi,
  animations: BlockAnimationsPlugin,
  opts: { channel?: string; bus?: Bus; follower?: 'next' } = {},
): () => void {
  const bus = opts.bus ?? new BroadcastChannel(opts.channel ?? 'adv-slides');
  const from = Math.random().toString(36).slice(2);
  const follower = opts.follower === 'next';
  // The fraction breaks ties between windows opened in the same millisecond.
  const born = Date.now() + Math.random();
  // The oldest window whose answer this window followed so far. It starts as itself, except for a
  // follower: it never leads, so it takes an answer from any window, the oldest winning.
  let followed = follower ? Infinity : born;
  let applying = false;

  const current = (): Omit<Extract<Message, { type: 'state' }>, 'type' | 'from'> => {
    const { h, v, f } = reveal.getIndices();
    return { state: { indexh: h, indexv: v ?? 0, indexf: f }, clicks: animations.clicked() };
  };
  const key = (m: { state: State; clicks: string[] }) => JSON.stringify([m.state.indexh, m.state.indexv, m.state.indexf ?? null, m.clicks]);
  let last = key(current());

  const post = () => {
    if (follower || applying) return;
    const now = current();
    if (key(now) === last) return;
    last = key(now);
    bus.postMessage({ type: 'state', from, ...now } satisfies Message);
  };

  const apply = (m: Extract<Message, { type: 'state' }>) => {
    if (!follower && key(m) === key(current())) return;
    applying = true;
    try {
      const { indexh, indexv, indexf } = m.state;
      reveal.slide(indexh, indexv, indexf);
      animations.restore(m.clicks);
      if (follower) reveal.next();
    } finally {
      applying = false;
    }
    last = key(current());
  };

  bus.addEventListener('message', e => {
    const m = e.data as Message;
    if (m.from === from) return;
    if (m.type === 'hello') {
      if (!follower) bus.postMessage({ type: 'state', from, ...current(), born } satisfies Message);
    } else if (m.born == null) {
      apply(m);
    } else if (m.born < followed) {
      followed = m.born;
      apply(m);
    }
  });

  const events = ['slidechanged', 'fragmentshown', 'fragmenthidden'];
  events.forEach(name => reveal.on(name, post));
  animations.onTrigger(post);
  bus.postMessage({ type: 'hello', from } satisfies Message);
  if (!follower) bus.postMessage({ type: 'state', from, ...current(), born } satisfies Message);

  return () => {
    events.forEach(name => reveal.off(name, post));
    bus.close();
  };
}
