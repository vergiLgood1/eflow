---
trigger: always_on
---

[system]
These rules are STRICT and MUST be followed in every response.
Do not ignore them under any circumstances.

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Naming Conventions](#2-naming-conventions)
3. [Types & Type Safety](#3-types--type-safety)
4. [Functions & Methods](#4-functions--methods)
5. [Error Handling](#5-error-handling)
6. [Comments & Documentation](#6-comments--documentation)
7. [Project Structure & Files](#7-project-structure--files)
8. [Testing](#8-testing)
9. [Git & Version Control](#9-git--version-control)
10. [Security](#10-security)
11. [Performance](#11-performance)
12. [Code Review Etiquette](#12-code-review-etiquette)
13. [PR Checklist](#13-pr-checklist)

---

## 1. Core Principles

These are the values every rule below serves. When in doubt, return to these.

| Principle      | What it means                                                                           |
| -------------- | --------------------------------------------------------------------------------------- |
| **Readable**   | Code is read 10× more than it is written. Optimize for the reader.                      |
| **Simple**     | Avoid accidental complexity. The simplest solution that works is correct.               |
| **Consistent** | Follow the team's conventions even if you disagree. Raise it in a discussion, not a PR. |
| **Testable**   | If something is hard to test, it is a design problem. Redesign it.                      |
| **Secure**     | Secure by default. Never defer security to "later".                                     |

### The Three Laws

```
MUST   → Non-negotiable. CI blocks merge. No exceptions without lead approval.
SHOULD → Strong default. Deviation requires a comment in the PR explaining why.
PREFER → Best practice. Deviate freely, but be ready to defend it in review.
```

---

## 2. Naming Conventions

### [MUST] Use intent-revealing names

Names must answer: _what does this hold or do?_ Never abbreviate unless the abbreviation is universally understood (e.g., `id`, `url`, `api`).

```ts
// BAD
const d = 7;
const u = users.filter(x => x.s === 1);
function proc(p) { ... }

// GOOD
const daysUntilExpiry = 7;
const activeUsers = users.filter(user => user.status === STATUS.ACTIVE);
function processPayment(payment) { ... }
```

### [MUST] Follow casing conventions consistently

| Context                      | Convention             | Example                     |
| ---------------------------- | ---------------------- | --------------------------- |
| Variables & functions        | `camelCase`            | `userProfile`, `fetchById`  |
| Classes & types & interfaces | `PascalCase`           | `OrderProcessor`, `UserDTO` |
| Module-level constants       | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT`           |
| Files & directories          | `kebab-case`           | `user-profile.service.ts`   |
| Database columns             | `snake_case`           | `created_at`, `user_id`     |
| Environment variables        | `SCREAMING_SNAKE_CASE` | `DATABASE_URL`              |

### [MUST] Boolean names must read as yes/no questions

```ts
// BAD
let loading, error, active, modal;

// GOOD
let isLoading, hasError, isActive, isModalOpen;
let canEdit, shouldRetry, hasPermission, wasDeleted;
```

### [SHOULD] Functions start with a verb; variables and classes use nouns

```ts
// Functions — verb first
getUserById()
validateEmailFormat()
buildRequestPayload()
handlePaymentFailure()
parseISODate()

// Classes — noun
class UserRepository { ... }
class PaymentGateway { ... }
```

### [PREFER] Avoid negated boolean names

```ts
// BAD — double-negative is hard to reason about
if (!isNotActive) { ... }

// GOOD
if (isActive) { ... }
```

---

## 3. Types & Type Safety

### [MUST] Never use `any` — use `unknown` when the type is truly unknown

`any` disables the type system. `unknown` forces you to narrow before use.

```ts
// BAD
function parseConfig(raw: any): Config { ... }

// GOOD
function parseConfig(raw: unknown): Config {
  if (!isConfig(raw)) throw new TypeError("Invalid config shape");
  return raw;
}
```

### [MUST] Prefer explicit return types on public functions

```ts
// BAD — return type inferred, changes silently break callers
export function getUser(id: string) {
  return db.users.find(id);
}

// GOOD
export function getUser(id: string): Promise<User | null> {
  return db.users.find(id);
}
```

### [MUST] Model missing values explicitly — never rely on `undefined` leaking through

```ts
// BAD — caller must know that undefined = not found
function findUser(id: string): User | undefined { ... }

// GOOD — intent is explicit
type Option<T> = { found: true; value: T } | { found: false };
function findUser(id: string): Option<User> { ... }

// Also acceptable with null (be consistent per project)
function findUser(id: string): User | null { ... }
```

### [MUST] Use union types to model mutually exclusive states

```ts
// BAD — booleans that could be in an illegal combination
interface FetchState {
  isLoading: boolean;
  isError: boolean;
  data?: User;
  error?: string;
}

// GOOD — impossible states are unrepresentable
type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; message: string };
```

### [MUST] Use enums or string literal unions for finite sets of values

```ts
// BAD
const STATUS = "active"; // magic string

// GOOD — string literal union (simple cases)
type UserStatus = "active" | "inactive" | "suspended";

// GOOD — enum (when values are used across many files)
enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
```

### [SHOULD] Use branded/nominal types for primitive IDs

Plain `string` or `number` IDs are easy to confuse. Branding prevents passing a `UserId` where an `OrderId` is expected.

```ts
// BAD — compiler allows swapping these accidentally
function getOrder(userId: string, orderId: string) { ... }

// GOOD
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function getOrder(userId: UserId, orderId: OrderId) { ... }
```

### [SHOULD] Prefer `readonly` and immutability by default

```ts
// GOOD — prevent accidental mutation
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

function process(items: readonly Item[]): Result[] { ... }
```

### [SHOULD] Avoid type assertions (`as`) — use type guards instead

```ts
// BAD — bypasses the type system
const user = response.data as User;

// GOOD — runtime check + compile-time narrowing
function isUser(val: unknown): val is User {
  return (
    typeof val === "object" && val !== null && "id" in val && "email" in val
  );
}
const user = isUser(response.data) ? response.data : null;
```

### [PREFER] Use `satisfies` operator to validate without widening (TypeScript 4.9+)

```ts
// Validates the shape at definition time without losing literal types
const routes = {
  home: "/",
  profile: "/profile",
  settings: "/settings",
} satisfies Record<string, string>;
```

### [PREFER] Co-locate types with the code that owns them

```
user/
  user.types.ts       ← types owned by this module
  user.service.ts
  user.repository.ts
```

Avoid a single top-level `types.ts` that becomes a dumping ground.

---

## 4. Functions & Methods

### [MUST] One function = one responsibility

If you cannot name it without using "and" or "or", it does too much. Split it.

```ts
// BAD — validates AND saves AND sends email
async function handleUserRegistration(data) { ... }

// GOOD — each step is separate and testable
async function registerUser(data: RegistrationDTO): Promise<User> {
  const validated = validateRegistrationData(data);
  const user = await userRepository.create(validated);
  await emailService.sendWelcome(user.email);
  return user;
}
```

### [MUST] Maximum 3 function parameters — group the rest into an object

```ts
// BAD
function createUser(name: string, email: string, role: Role, timezone: string, isVerified: boolean) { ... }

// GOOD
interface CreateUserOptions {
  name: string;
  email: string;
  role: Role;
  timezone: string;
  isVerified: boolean;
}
function createUser(options: CreateUserOptions): Promise<User> { ... }
```

### [MUST] Return early — avoid deep nesting (max 3 levels)

```ts
// BAD
function process(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission("write")) {
        // logic buried 3 levels deep
      }
    }
  }
}

// GOOD
function process(user: User | null) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission("write")) return;
  // logic at the top level
}
```

### [MUST] Functions must be ≤ 40 lines (excluding signature and closing brace)

Longer functions are a signal to extract. Track with your linter (`max-lines-per-function`).

### [SHOULD] Prefer pure functions — avoid hidden side effects

A pure function: same input → same output, touches nothing outside itself.
Side-effecting functions must be named accordingly (`sendEmail`, `writeToDb`).

```ts
// BAD — hides a side effect
function getUser(id: string): User {
  logger.log(`Fetching user ${id}`); // side effect
  return userCache.get(id);
}

// GOOD — side effects are visible at the call site
function getUser(id: string): User {
  return userCache.get(id);
}
function logUserFetch(id: string): void {
  logger.log(`Fetching user ${id}`);
}
```

### [SHOULD] Prefer composition over inheritance

```ts
// PREFER composition
class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly email: EmailService,
  ) {}
}

// AVOID deep inheritance chains
class SuperAdminUser extends AdminUser extends BaseUser extends Entity { ... }
```

### [PREFER] Use default parameters instead of conditional assignment

```ts
// BAD
function greet(name?: string) {
  const n = name !== undefined ? name : "Guest";
  ...
}

// GOOD
function greet(name = "Guest") { ... }
```

---
