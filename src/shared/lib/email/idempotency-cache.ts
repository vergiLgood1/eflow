/** How long a processed webhook event id is remembered, in milliseconds. */
const DEFAULT_TTL_MS = 15 * 60 * 1000;

/** Upper bound on remembered ids, so an unbounded key space cannot leak. */
const DEFAULT_MAX_ENTRIES = 1_000;

/**
 * Remembers recently processed webhook event ids.
 *
 * Neon retries a failed `send.magic_link` delivery up to 3 times with the same
 * `X-Neon-Event-Id`, which would send the user up to three copies of the same
 * email. This collapses those retries into one.
 *
 * It is per-process and therefore best-effort: on a serverless platform a
 * retry can land on a cold instance and send a duplicate. That is an
 * acceptable trade for a duplicate email — far cheaper than a shared store
 * (Redis/Postgres round-trip) on the blocking email path. If duplicate
 * suppression ever becomes a hard requirement, move this behind the database.
 */
export class IdempotencyCache {
  private readonly seen = new Map<string, number>();

  constructor(
    private readonly ttlMs: number = DEFAULT_TTL_MS,
    private readonly maxEntries: number = DEFAULT_MAX_ENTRIES,
  ) {}

  /**
   * Records `eventId` and reports whether it had already been seen.
   *
   * @returns `true` when this is the first time the id arrives.
   */
  claim(eventId: string): boolean {
    this.evictExpired();

    if (this.seen.has(eventId)) {
      return false;
    }

    // Re-insert to refresh insertion order, making eviction least-recent-first.
    this.seen.delete(eventId);
    this.seen.set(eventId, Date.now());

    if (this.seen.size > this.maxEntries) {
      const oldest = this.seen.keys().next();
      if (!oldest.done) this.seen.delete(oldest.value);
    }

    return true;
  }

  /**
   * Drops a previously claimed id.
   *
   * Called when the work that id guarded failed, so the provider's retry is not
   * mistaken for a duplicate delivery and skipped.
   */
  release(eventId: string): void {
    this.seen.delete(eventId);
  }

  private evictExpired(): void {
    const cutoff = Date.now() - this.ttlMs;

    for (const [key, recordedAt] of this.seen) {
      if (recordedAt < cutoff) {
        this.seen.delete(key);
        continue;
      }
      // Insertion order is recency order, so the first live entry ends the scan.
      break;
    }
  }
}