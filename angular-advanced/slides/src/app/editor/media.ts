// Helpers for images, tables and pen drawings.

export interface Point { x: number; y: number }

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Distance from p to the line through a and b. */
function offLine(p: Point, a: Point, b: Point) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (!len) return Math.hypot(p.x - a.x, p.y - a.y);
  return Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
}

/** Keeps the points that matter within `tolerance` px (Ramer–Douglas–Peucker). */
function simplify(points: Point[], tolerance: number): Point[] {
  if (points.length < 3) return points;
  let far = 0, at = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = offLine(points[i], points[0], points[points.length - 1]);
    if (d > far) { far = d; at = i; }
  }
  if (far <= tolerance) return [points[0], points[points.length - 1]];
  return [...simplify(points.slice(0, at + 1), tolerance).slice(0, -1), ...simplify(points.slice(at), tolerance)];
}

/** An SVG path through a pen stroke, simplified to within 1 px. */
export function pointsToPath(points: Point[]): string {
  return simplify(points, 1).map((p, i) => `${i ? 'L' : 'M'}${r2(p.x)} ${r2(p.y)}`).join(' ');
}

const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

/** A file name the slide folder accepts (lowercase letters, digits, dot, dash), or null for non-images. */
export function safeImageName(name: string): string | null {
  const dot = name.lastIndexOf('.');
  const ext = name.slice(dot + 1).toLowerCase();
  if (dot < 0 || !IMAGE_TYPES.includes(ext)) return null;
  const base = name.slice(0, dot).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
  return `${base}.${ext}`;
}

/** `name`, or `name-2`, `name-3`… when taken. */
export async function uniqueImageName(name: string, taken: (name: string) => Promise<boolean>): Promise<string> {
  const dot = name.lastIndexOf('.');
  let candidate = name;
  for (let n = 2; await taken(candidate); n++) candidate = `${name.slice(0, dot)}-${n}${name.slice(dot)}`;
  return candidate;
}

export type TableEdit = 'add-row' | 'remove-row' | 'add-column' | 'remove-column';

/** Adds or removes the last row or column of a table block's HTML, keeping at least one of each. */
export function editTable(html: string, op: TableEdit): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return html;
  const rows = [...table.querySelectorAll('tr')];
  const last = rows[rows.length - 1];
  if (op === 'add-row' && last) {
    const row = doc.createElement('tr');
    for (let i = 0; i < last.children.length; i++) row.append(doc.createElement('td'));
    last.after(row);
  } else if (op === 'remove-row' && rows.length > 1) {
    last.remove();
  } else if (op === 'add-column') {
    for (const row of rows) row.append(doc.createElement(row.lastElementChild?.tagName.toLowerCase() === 'th' ? 'th' : 'td'));
  } else if (op === 'remove-column' && (rows[0]?.children.length ?? 0) > 1) {
    for (const row of rows) row.lastElementChild?.remove();
  }
  return table.outerHTML;
}

export const NEW_TABLE = '<table><tbody><tr><th>Header</th><th>Header</th><th>Header</th></tr>'
  + '<tr><td>Cell</td><td>Cell</td><td>Cell</td></tr><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr></tbody></table>';
