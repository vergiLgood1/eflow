import { z } from "zod";

/**
 * Payload contract for the Neon Auth `send.magic_link` webhook event.
 *
 * Neon drops any `user` field outside a fixed allowlist, so these schemas
 * validate exactly what is documented to arrive and treat the rest as absent.
 * See https://neon.com/docs/auth/guides/webhooks
 */

export const linkTypeSchema = z.enum([
  "sign-in",
  "email-verification",
  "forget-password",
]);

export type LinkType = z.infer<typeof linkTypeSchema>;

const magicLinkEventDataSchema = z.object({
  link_type: linkTypeSchema,
  /** Full Neon-hosted URL with the token embedded. */
  link_url: z.string().min(1),
  /** Raw token, used to build a branded link into this app. */
  token: z.string().min(1),
  expires_at: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
});

const webhookUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().min(1),
  name: z.string().nullish(),
});

export const neonAuthEmailWebhookSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  timestamp: z.string().optional(),
  user: webhookUserSchema,
  event_data: magicLinkEventDataSchema,
});

export type NeonAuthEmailWebhook = z.infer<typeof neonAuthEmailWebhookSchema>;

/**
 * Lifetimes quoted in email copy. Neon expires verification and reset links
 * after 15 minutes; keeping this in one place means the templates and the
 * webhook handler cannot drift apart.
 */
export const EMAIL_LINK_EXPIRY_MINUTES = 15;