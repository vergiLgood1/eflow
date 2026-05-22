## 5. Error Handling

### [MUST] Never swallow errors silently

An empty catch block is a lie. Always log, rethrow, or convert.

```ts
// BAD
try {
  doSomething();
} catch (_) {}

// GOOD
try {
  doSomething();
} catch (error) {
  logger.error("doSomething failed", { error, context });
  throw error;
}
```

### [MUST] Use typed, domain-specific error classes

```ts
// BAD
throw new Error("User not found"); // untyped, uncatchable by type

// GOOD
export class UserNotFoundError extends Error {
  constructor(public readonly userId: string) {
    super(`User not found: ${userId}`);
    this.name = "UserNotFoundError";
  }
}

// Caller can now handle specifically:
try { ... }
catch (error) {
  if (error instanceof UserNotFoundError) return null;
  throw error;
}
```

### [MUST] Add context when re-throwing

```ts
// BAD
} catch (e) { throw e; }

// GOOD
} catch (cause) {
  throw new PaymentServiceError("Charge failed during checkout", { cause, orderId });
}
```

### [SHOULD] Use Result type for expected failures (recoverable business errors)

Exceptions are for unexpected situations. For predictable failures use a Result:

```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function chargeCard(
  amount: number,
): Promise<Result<Receipt, PaymentError>> {
  try {
    const receipt = await gateway.charge(amount);
    return { ok: true, value: receipt };
  } catch (cause) {
    return { ok: false, error: new PaymentError("Charge failed", { cause }) };
  }
}

// Callers are forced to handle both paths
const result = await chargeCard(100);
if (!result.ok) {
  showUserFriendlyError(result.error);
  return;
}
showReceipt(result.value);
```

### [SHOULD] Validate all external input at the boundary — never assume shape

```ts
import { z } from "zod"; // or joi, yup, arktype, etc.

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "guest"]),
});

// Parse once at the edge — trust the type inside
const user = UserSchema.parse(req.body);
```

---

## 6. Comments & Documentation

### [MUST] Comments explain WHY, not WHAT

The code shows what is happening. Comments explain why it happens this way.

```ts
// BAD — restates the code
// increment i by 1
i++;

// GOOD — explains a non-obvious decision
// Using setTimeout(0) to defer until after the current render cycle.
// Direct DOM manipulation here causes a layout thrash on Safari 16.
setTimeout(() => updateDOM(), 0);
```

### [MUST] Delete commented-out code before merging

Git history preserves deleted code. Commented-out code is noise and confuses readers.

### [SHOULD] All public functions, classes, and modules have JSDoc / docstrings

```ts
/**
 * Calculates the pro-rated refund amount for a cancelled subscription.
 *
 * @param subscription - The subscription being cancelled
 * @param cancelledAt  - The timestamp of cancellation
 * @returns            - Refund amount in the subscription's currency, rounded down to cents
 *
 * @throws {InvalidSubscriptionError} if subscription has already expired
 */
function calculateRefund(subscription: Subscription, cancelledAt: Date): Money { ... }
```

### [SHOULD] Use `TODO` and `FIXME` with an owner and ticket

```ts
// TODO(alice): Remove this fallback after migration to v2 API — TICKET-4521
// FIXME(bob): This is O(n²) — must be optimized before >10k users — TICKET-4832
```

### [PREFER] Write self-documenting code before reaching for a comment

If you need a comment to explain a variable name, rename the variable.

---

## 7. Project Structure & Files

### [MUST] One primary export per file — named after the file

```
user.service.ts       → exports UserService
user.repository.ts    → exports UserRepository
user.types.ts         → exports UserDTO, UserStatus, etc.
```

### [MUST] Keep files under 300 lines

Longer files are a signal to split by concern.

### [SHOULD] Follow the feature/domain folder pattern

```
src/
  users/
    user.controller.ts
    user.service.ts
    user.repository.ts
    user.types.ts
    user.service.test.ts
  orders/
    order.controller.ts
    ...
  shared/
    errors/
    utils/
    middleware/
```

Avoid organizing by technical role (`controllers/`, `services/`) across all features — it creates far-away coupling.

### [SHOULD] Use barrel files (`index.ts`) only at module boundaries

```ts
// users/index.ts — the public API of the users module
export { UserService } from "./user.service";
export type { UserDTO, UserStatus } from "./user.types";
// Internal files are NOT re-exported
```

### [PREFER] Co-locate tests with source files

```
user.service.ts
user.service.test.ts   ← next to the file it tests
```

---

## 8. Testing

### [MUST] Every new feature ships with tests — no exceptions

Minimum: one happy path + one failure/edge case per function.

### [MUST] Tests follow the AAA pattern: Arrange, Act, Assert

```ts
it("returns 401 when the JWT has expired", async () => {
  // Arrange
  const expiredToken = buildJWT({ expiresAt: yesterday() });

  // Act
  const response = await api
    .get("/me")
    .set("Authorization", `Bearer ${expiredToken}`);

  // Assert
  expect(response.status).toBe(401);
  expect(response.body.code).toBe("TOKEN_EXPIRED");
});
```

### [MUST] Test names describe the scenario, not the implementation

```ts
// BAD
it("works");
it("test getUserById");

// GOOD
it("returns null when user does not exist");
it("throws UserSuspendedError when account is suspended");
it("sends welcome email after successful registration");
```

### [MUST] Tests must be deterministic — no flaky tests allowed in main

Flaky tests erode trust in the entire suite. A test that fails intermittently must be fixed or deleted.

### [SHOULD] Test behavior, not implementation details

Tests should survive internal refactoring without breaking.

```ts
// BAD — testing private internals
expect(service._cache.has(userId)).toBe(true);

// GOOD — testing observable behavior
const result1 = await service.getUser(userId);
const result2 = await service.getUser(userId);
expect(mockDb.query).toHaveBeenCalledTimes(1); // caching works — db called once
```

### [SHOULD] Use the test pyramid: many unit, some integration, few E2E

```
         /\
        /E2E\       ← critical user journeys only (slow, expensive)
       /------\
      / Integ. \    ← service/API boundary tests
     /----------\
    /  Unit tests \  ← fast, isolated, most of them
   /--------------\
```

### [SHOULD] Mock at the boundary, not in the middle

Mock external services (HTTP, DB, email) — not internal modules. Every internal mock you add is a coupling you're hiding.

### [PREFER] Coverage targets are floors, not goals

- Overall: ≥ 80% line coverage
- Critical business logic: 100% branch coverage
- Don't write tests just to hit a number — test what matters.

---

## 9. Git & Version Control

### [MUST] Follow Conventional Commits format

```
<type>(<scope>): <short summary in present tense, lowercase>

[optional body — explain the WHY, not the what]

[optional footer: BREAKING CHANGE, closes #issue]
```

| Type       | When                                |
| ---------- | ----------------------------------- |
| `feat`     | New feature                         |
| `fix`      | Bug fix                             |
| `refactor` | Refactoring without behavior change |
| `test`     | Adding or fixing tests              |
| `docs`     | Documentation only                  |
| `chore`    | Tooling, deps, config               |
| `perf`     | Performance improvement             |
| `ci`       | CI/CD pipeline changes              |

```bash
# BAD
git commit -m "fix"
git commit -m "WIP"
git commit -m "stuff"

# GOOD
git commit -m "feat(auth): add refresh token rotation"
git commit -m "fix(orders): prevent double-charge on network retry"
git commit -m "refactor(users): extract address validation into AddressValidator"
```

### [MUST] Never commit secrets, credentials, or API keys

- Add `.env` to `.gitignore` before the first commit
- Use a secrets manager (Vault, AWS Secrets Manager, Doppler)
- Install `git-secrets` or `gitleaks` as a pre-commit hook
- If a secret is ever committed: **rotate it immediately** — history is permanent

### [MUST] One logical change per PR

PRs reviewable in under 20 minutes get reviewed properly. Aim for < 400 lines changed.
If a PR must be large, add a walkthrough comment at the top explaining the structure.

### [MUST] Branches must be up-to-date with main before merging

Rebase or merge main into your branch. Never merge a branch with known conflicts.

### [SHOULD] Feature branches are short-lived (≤ 3 days)

Long-lived branches accumulate painful merge conflicts and delay integration bugs.
Use feature flags to ship incomplete features safely to main (trunk-based development).

### [SHOULD] PR titles follow Conventional Commits format

PR title = the squashed commit message. Keep it consistent.

### [PREFER] Squash commits before merging for a clean history

One logical change = one commit on main. Use the "Squash and merge" strategy.

---

## 10. Security

### [MUST] Validate and sanitize all user input at the boundary

Never trust data from: HTTP requests, CLI args, files, environment variables, or databases.
Validate type, length, format, and range before processing.

### [MUST] Use parameterized queries — never build SQL with string concatenation

```ts
// BAD — SQL injection
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// GOOD
db.query("SELECT * FROM users WHERE email = $1", [email]);
```

### [MUST] Apply principle of least privilege everywhere

- DB users: read-only where write is not needed
- IAM roles: minimal policy attachments
- API keys: scoped to the specific service
- Never use admin/root credentials in application code

### [MUST] Use HTTPS for all external communication — no plain HTTP in production

### [SHOULD] Rate-limit all public endpoints

```ts
// Express example
import rateLimit from "express-rate-limit";
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
```

### [SHOULD] Audit dependencies regularly

```bash
npm audit         # Node
pip-audit         # Python
cargo audit       # Rust
trivy fs .        # Generic / Docker
```

Pin major versions. Allow patch updates for security fixes. Review lock file changes in PRs — they ship code.

### [SHOULD] Never log sensitive data

```ts
// BAD
logger.info("User login", { email, password });

// GOOD
logger.info("User login", { userId: user.id });
```

### [PREFER] Use security linting rules in your static analysis

ESLint: `eslint-plugin-security`, `eslint-plugin-no-secrets`
Bandit (Python), Semgrep (multi-language)

---
