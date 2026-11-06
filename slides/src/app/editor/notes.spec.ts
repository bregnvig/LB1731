import { describe, expect, it } from 'vitest';
import { joinNotes, splitNotes } from './notes';

describe('speaker notes', () => {
  it('splits at the first blank line', () => {
    expect(splitNotes('Cue one\nCue two\n\nTalk.\n\nMore talk.')).toEqual({ quick: 'Cue one\nCue two', description: 'Talk.\n\nMore talk.' });
  });

  it(`keeps notes without a blank line as quick cues`, () => {
    expect(splitNotes('Introduce yourself.')).toEqual({ quick: 'Introduce yourself.', description: '' });
  });

  it('joins back to the same text', () => {
    const notes = 'Cues\n\nTalk.\n\nMore.';
    const { quick, description } = splitNotes(notes);
    expect(joinNotes(quick, description)).toBe(notes);
  });

  it('keeps a blank line typed in the quick cues out of the split', () => {
    expect(joinNotes('a\n\nb', 'Talk.')).toBe('a\nb\n\nTalk.');
  });

  it(`writes no blank line when the description is ''`, () => {
    expect(joinNotes('Cues', '')).toBe('Cues');
  });
});
