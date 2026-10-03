-- Normalise `users.email` to the form Neon Auth already stores.
--
-- Sign-up now trims and lower-cases the address before writing it, because Neon
-- normalises at its own boundary. Any row still holding the casing a user typed
-- would not match the uniqueness pre-check for its lowercase form, so a retry
-- from the same person could mint a second local row for one Neon identity.
--
-- `users.email` is referenced by nothing but its own unique index -- every
-- foreign key in this schema points at `users.id` -- so rewriting it in place
-- cannot cascade into dependent rows.
--
-- Rows whose lowercase form is already taken are deliberately left alone: they
-- are the genuine two-identities-one-address case, and collapsing them here would
-- either violate the unique index or silently pick a winner. They need a human.
UPDATE "users" AS u
SET "email" = lower(btrim(u."email"))
WHERE u."email" <> lower(btrim(u."email"))
  AND NOT EXISTS (
    SELECT 1
    FROM "users" AS c
    WHERE c."email" = lower(btrim(u."email"))
      AND c."id" <> u."id"
  );