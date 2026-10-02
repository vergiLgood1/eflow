/**
 * Contracts for outbound transactional email.
 *
 * The rest of the app depends on {@link EmailMessage} and
 * {@link EmailSendResult} only, so swapping Resend for another provider is a
 * change to `email-provider.ts` alone.
 */

/** A provider metadata pair, surfaced as a searchable tag in Resend. */
export interface EmailTag {
  readonly name: string;
  readonly value: string;
}

/**
 * One outbound email.
 *
 * `html` and `text` are both required: the HTML part carries the branded
 * template, the text part is the fallback for clients that refuse HTML and the
 * only body that survives strict spam filters.
 */
export interface EmailMessage {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
  readonly tags?: readonly EmailTag[];
}

/**
 * Delivery outcome.
 *
 * Modelled as a union rather than a thrown error so that a provider outage is
 * an explicit value callers must handle — Neon Auth retries blocking webhook
 * events, and it only retries when the handler fails loudly.
 */
export type EmailSendResult =
  | { readonly status: "sent"; readonly id: string }
  | { readonly status: "failed"; readonly reason: string };

/** Transport that can deliver an {@link EmailMessage}. */
export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

/**
 * A rendered template: subject plus both body parts, ready to hand to
 * {@link EmailProvider.send}. Templates return this instead of calling the
 * provider so rendering stays a pure, unit-testable function.
 */
export interface EmailContent {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}