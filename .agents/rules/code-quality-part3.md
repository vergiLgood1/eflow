---
trigger: always_on
---

## 11. Performance

### [SHOULD] Avoid premature optimization — profile before optimizing

Measure first. Never optimize code that is not a measured bottleneck.

### [SHOULD] Avoid N+1 query patterns

```ts
// BAD — 1 query for users + N queries for orders
const users = await getUsers();
for (const user of users) {
  user.orders = await getOrdersByUser(user.id); // N queries
}

// GOOD — 2 queries total
const users = await getUsers();
const orders = await getOrdersByUserIds(users.map((u) => u.id));
const ordersByUser = groupBy(orders, "userId");
users.forEach((u) => (u.orders = ordersByUser[u.id] ?? []));
```

### [SHOULD] Paginate all list endpoints — never return unbounded results

```ts
// BAD
app.get("/users", async (req, res) => {
  const users = await db.users.findAll(); // could return millions
  res.json(users);
});

// GOOD
app.get("/users", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const users = await db.users.findAll({
    skip: (page - 1) * limit,
    take: limit,
  });
  res.json({ data: users, page, limit });
});
```

### [PREFER] Use lazy loading and code splitting for frontend bundles

### [PREFER] Cache expensive operations — and document cache invalidation strategy

```ts
// Document your cache clearly
// Cache TTL: 5 minutes
// Invalidated by: user profile update, role change
const cachedUser = await cache.get(`user:${userId}`, {
  ttl: 300,
  fetch: () => db.users.find(userId),
});
```

---

## 12. Code Review Etiquette

### For the author

- Self-review your diff before requesting review — catch your own issues first
- Keep PRs small and focused
- Add a PR description that explains the **why**, not the what
- Respond to every review comment — either fix it or explain why not
- Don't take feedback personally — the review is about the code, not you

### For the reviewer

- Review within 24 hours of request (business days)
- Be specific — "this is wrong" is not a review comment
- Prefix comments by severity:

  ```
  [MUST]   This will cause a bug / violates a rule — must fix before merge
  [SHOULD] Strong suggestion — needs a reason to skip
  [NIT]    Minor style preference — author can decide
  [Q]      Genuine question, not a request to change
  ```

- Approve only when you would be comfortable owning this code

---

## 13. PR Checklist

Copy this into your PR description and check every item before requesting review.

```markdown
## PR Checklist

### Must (CI also enforces these)

- [ ] All tests pass locally (`npm test` / `pytest`)
- [ ] No linter or type errors (`npm run lint` / `mypy`)
- [ ] No hardcoded secrets, passwords, or API keys
- [ ] No `console.log` / `print` / debug statements left in
- [ ] Error paths are handled — no silent `catch` blocks
- [ ] New code has at least one test for the failure/edge case

### Should (enforced in review)

- [ ] Function and variable names clearly describe intent
- [ ] No function exceeds 40 lines
- [ ] Types are explicit on public function signatures
- [ ] No use of `any` type (use `unknown` + guard instead)
- [ ] Commit messages follow Conventional Commits format
- [ ] PR description explains the WHY, not just the what

### Prefer (best effort)

- [ ] Self-reviewed the diff line by line before requesting review
- [ ] Dependencies audited (`npm audit` or equivalent)
- [ ] Performance impact considered for hot paths
- [ ] Public API documentation updated if interface changed
- [ ] Feature flag added if this is a partial implementation

## What does this PR do?

<!-- 2-3 sentences max -->

## Why is this change needed?

<!-- Link to ticket, issue, or explain the business reason -->

## How was this tested?

<!-- Unit tests? Manual? Staging? -->

## Any known trade-offs or follow-up work?

<!-- Optional — link tickets for known shortcuts -->
```

---

## 14. Workflow & Task Management

### [MUST] Create a GitHub issue for every task

Before starting any work on a new feature, bug fix, or refactor, a GitHub issue must be created to track the work.

- Use clear, descriptive titles for issues.
- Include a summary of the problem or feature in the issue description.
- Link the PR to the issue using "closes #issue_number" or "fixes #issue_number".
- For AI agents: Always check for an existing issue or create one before proposing a plan.

---

## Appendix: Enforcement Tools

| Rule Category     | Recommended Tool                                                |
| ----------------- | --------------------------------------------------------------- |
| Type safety       | TypeScript strict mode, `tsconfig` `"strict": true`             |
| Linting           | ESLint + `@typescript-eslint`, Pylint / Ruff                    |
| Formatting        | Prettier (JS/TS), Black (Python) — non-negotiable, auto-applied |
| Security scanning | `bun audit`, `npm audit`, `pip-audit`, Semgrep, Trivy           |
| Secret detection  | `gitleaks`, `git-secrets` (pre-commit hook)                     |
| Commit format     | `commitlint` + `husky`                                          |
| Coverage          | Jest `--coverage`, Pytest-cov — CI fails below threshold        |
| Complexity        | ESLint `complexity` rule (max: 10), `cognitive-complexity`      |

---

_Last updated: [DATE] · Maintained by: [LEAD DEVELOPER / TEAM NAME]_
_Raise suggestions as a PR against this file — not in chat._
