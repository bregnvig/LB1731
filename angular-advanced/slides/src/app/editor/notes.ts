/** Speaker notes are quick cues, a blank line, then the talk script (the description). */
export function splitNotes(notes: string) {
  const at = notes.indexOf('\n\n');
  return at < 0 ? { quick: notes, description: '' } : { quick: notes.slice(0, at), description: notes.slice(at + 2) };
}

/** A blank line typed in the quick cues would move the rest into the description, so it stays one newline. */
export function joinNotes(quick: string, description: string) {
  const cues = quick.replace(/\n{2,}/g, '\n');
  return description ? `${cues}\n\n${description}` : cues;
}
