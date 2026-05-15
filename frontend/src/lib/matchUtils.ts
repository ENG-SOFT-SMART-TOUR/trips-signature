/**
 * Local (client-side) destination-match heuristic.
 *
 * NOTE: when the user has no tags this returns a pseudo-random percentage so
 * the UI still has something to show. The backend (YGG-13) owns the real match
 * algorithm; this is a placeholder until the front consumes it directly.
 */
export function calculateMatch(userTags: string[], destTags: string[]): number {
  if (userTags.length === 0) return Math.floor(Math.random() * 30 + 60);
  const matches = destTags.filter((tag) => userTags.includes(tag)).length;
  return Math.min(
    100,
    Math.floor((matches / Math.max(destTags.length, userTags.length)) * 100 + 30),
  );
}
