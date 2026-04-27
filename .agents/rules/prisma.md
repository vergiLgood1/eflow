# Prisma Rules

## [MUST] Use Migrations for Schema Changes
Always use `prisma migrate dev` instead of `prisma db push` to maintain database migration history.

- **Development**: Use `bun prisma migrate dev --name your_migration_name` to apply changes and create a migration file.
- **Production**: Use `prisma migrate deploy` in CI/CD pipelines.
- **Reasoning**: `db push` is for rapid prototyping and bypasses migration history, which is dangerous for collaborative and production environments.

## [SHOULD] Name Migrations Descriptively
Use clear, snake_case names for migrations that describe the change (e.g., `add_is_public_to_data_model`).
