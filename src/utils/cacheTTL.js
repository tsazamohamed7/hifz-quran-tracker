export function shouldFetch({ lastFetched, ttl, dataLength, force }) {
  if (force) return true;

  if (!lastFetched) return true;

  const now = Date.now();
  const expired = now - lastFetched > ttl;

  if (expired) return true;

  if (!dataLength) return true;

  return false;
}