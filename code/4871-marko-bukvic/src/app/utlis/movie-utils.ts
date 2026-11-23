import { Movie } from '../models/movie.models';

/** "bestPicture" -> "Best Picture" */
export function formatOscarType(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

/** "Best Picture" -> "bestPicture" */
export function toOscarKey(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1)))
    .join('');
}

/** Count items per key; one item can count for several keys */
export function countBy<T>(items: T[], keysOf: (item: T) => string[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    for (const key of keysOf(item)) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const byTitle = (a: Movie, b: Movie) => a.title.localeCompare(b.title);

/** Genre sort from the task: by number of genres, then genre by genre (order inside a movie doesn't matter) */
export function compareGenres(a: string[], b: string[]): number {
  if (a.length !== b.length) return a.length - b.length;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    const diff = sa[i].localeCompare(sb[i]);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Numbers where null goes last */
export function compareNumbers(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}