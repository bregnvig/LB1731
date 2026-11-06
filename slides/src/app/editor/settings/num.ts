/** A number input's value; NaN when it is empty or not a number, so callers can ignore it. */
export const num = (e: Event): number => {
  const v = (e.target as HTMLInputElement).value.trim();
  return v === '' ? NaN : Number(v);
};

/** False when a patch holds a number that isn't one (an emptied field), which would write 0 or NaN. */
export const validPatch = (patch: object) => Object.values(patch).every(v => typeof v !== 'number' || Number.isFinite(v));
