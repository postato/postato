# Postato 🥔

**Mash your Postman collections into crispy TypeScript tests!**

We take your Postman requests and turn them into production-ready test fries—perfectly seasoned with TypeScript, Jest, and SuperTest.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-green)](https://jestjs.io/)
[![npm](https://img.shields.io/badge/%40postato%2Fshared-0.2.10-red)](https://www.npmjs.com/package/@postato/shared)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## The Problem

❌ Manually rewriting 100+ Postman requests as tests  
❌ Keeping tests in sync with Postman changes  
❌ Your API tests live in Postman jail (no git, no CI/CD)  
❌ Copy-pasting cURL commands like it's 2015

## The Solution

✅ One command to smash Postman into test files  
✅ TypeScript + Jest + SuperTest (the good stuff)  
✅ Git-friendly, CI/CD ready, actually maintainable  
✅ Optional: Let AI sprinkle assertions on top (5-15 min)

---

## Quick Start

```bash
# 1. Clone template
git clone https://github.com/postato/postato.git my-api-tests
cd my-api-tests
npm install

# 2. Add your Postman files
cp your_collection.json postman/v1/postman_collection.json
cp your_env.json postman/v1/dev.postman_environment.json

# 3. Generate tests
npm run generate -- -c postman/v1/postman_collection.json -e postman/v1/dev.postman_environment.json -o .

# 4. Add credentials to .env.development (CLI creates this file with structure)

# 5. Run tests
npm test
```

**Time: 2 minutes from Postman to running tests.**

---

## CLI Output

```
🥔 Postato - Generate API Test Skeletons
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Loading Postman files...
   Collection: Your API Collection
   Environment: Development

🔍 Analyzing environment variables...
   Architecture: MICROSERVICES (detected 3 services)
   Auth Pattern: MULTIPLE (detected 4 tokens)

⚙️  Updating template.config.ts...
   ✓ Configuration updated

📝 Generating files...
   ✓ .env.development
   ✓ src/config/environments/index.ts
   ✓ Request wrappers: 50
   ✓ Test files: 50
   ✓ Folders: 12

✅ Done! (1.8 seconds)

Next steps:
1. Add credentials to .env.development
2. Optional: AI fills TODO markers (see README)
3. Run: npm test
```

---

## What Gets Generated

**Request wrappers** (`src/requests/**/*.request.ts`) - ✅ Complete, ready to use

```typescript
export const getUser = async (authToken: string, userId: string) => {
  return createRequest()
    .get(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${authToken}`)
}
```

**Test skeletons** (`src/tests/**/*.spec.ts`) - 🔄 Structure ready, TODOs for assertions

```typescript
describe('GET /api/v1/users/:id', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await authHelper.getToken()
  })

  it('TODO: should return user details', async () => {
    const response = await getUser(authToken, '123')
    expect(response.status).toBe(200)
    // TODO: Add response body assertions
  })

  it('should return 401 for invalid token', async () => {
    const response = await getUser('invalid_token', '123')
    expect(response.status).toBe(401)
  })
})
```

**Configuration** - Auto-detected from Postman environment

- `template.config.ts` - Architecture pattern (SINGLE/MICROSERVICES, auth type)
- `.env.development` - Environment variables (you add credentials)
- `environments/index.ts` - Dynamic loader

---

## Optional: AI Fills TODOs

**If you want complete assertions**, use AI to fill TODO markers.

### Recommended Prompt for AI

Paste this to Claude/ChatGPT along with [`Agent Instructions`](.agent/AGENT_INSTRUCTIONS.md):

```
I've generated test skeletons using the CLI tool from @postato/shared. 
The files are in src/tests/ with TODO markers.

Please read .agent/AGENT_INSTRUCTIONS.md and complete the tests by:
1. Replacing placeholder test data with realistic values
2. Adding response body assertions (properties, types, values)
3. Adding edge case tests (400, 404, 409, etc.)

Work on one file at a time. Show me the complete updated file after each change.
```

**Time: 5-15 minutes for 50 test files**

### Alternative: GitHub Copilot

1. Open test file in VS Code
2. Place cursor on TODO line
3. Press Tab to accept suggestion
4. Review and adjust

**For detailed patterns and examples**, see [`Agent Instructions`](.agent/AGENT_INSTRUCTIONS.md)

---

## Configuration

The CLI tool from @postato/shared detects your architecture automatically:

| Your Postman Environment                         | Detected Pattern        |
| ------------------------------------------------ | ----------------------- |
| 1 base URL variable                              | **SINGLE** architecture |
| 2+ service URLs (`mainApiUrl`, `paymentsApiUrl`) | **MICROSERVICES**       |
| 1 token variable                                 | **SINGLE** auth         |
| 2+ tokens (`auth_token`, `admin_token`)          | **MULTIPLE** auth       |

**Example detection:**

```typescript
// From Postman environment variables:
// - MAIN_API_URL
// - PAYMENTS_API_URL
// - admin_token
// - client_token

// Generated config:
{
  architecture: ARCHITECTURE.MICROSERVICES,
  authPattern: AUTH_PATTERN.MULTIPLE,
  services: { MAIN: 'main', PAYMENTS: 'payments' },
  tokenTypes: { ADMIN: 'admin', CLIENT: 'client' }
}
```

All utilities (`auth-helper.ts`, `request-builder.ts`) read this config and adapt automatically.

---

## Running Tests

```bash
npm test                    # Run all tests
npm test -- tests/products  # Run specific folder
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode

TEST_ENV=staging npm test   # Use .env.staging
```

---

## Updating Collections

When Postman changes:

```bash
# 1. Export new collection
cp new_collection.json postman/v1/postman_collection.json

# 2. Regenerate (--overwrite replaces existing files)
npm run generate -- -c postman/v1/postman_collection.json -e postman/v1/dev.postman_environment.json -o . --overwrite

# 3. AI re-fills TODOs (only for new/modified files)

# 4. Run tests
npm test
```

**What happens:**

- New endpoints → new files with TODOs
- Modified endpoints → updated files
- Deleted endpoints → old files remain (delete manually)
- Config updates if architecture changes

---

## Known Limitations

**No response examples in Postman?**  
→ The generator still creates tests, but no JSON schema validation. AI uses basic assertions.

**Hardcoded IDs in URLs?** (e.g., `/users/abc-123-uuid`)  
→ Generated as-is. Review and convert to parameters if needed.

**Non-standard variable names?**  
→ The generator may misclassify. Check `template.config.ts` after generation.

**Special characters in folder names?**  
→ Auto-sanitized (e.g., `Products (CRUD)` → `products-crud/`)

**Missing environment file?**  
→ Defaults to SINGLE architecture + SINGLE auth. Configure manually in `template.config.ts`.

---

## Why Postato?

**vs. Manual Test Writing**

- 100x faster (2 seconds vs. 3+ hours for 50 endpoints)
- Zero inconsistencies in naming/structure
- Regenerate on Postman changes

**vs. AI-Only Generation**

- No hallucinations (generator is deterministic)
- Free (no AI API costs)
- Faster (2 seconds vs. 20+ minutes)

**vs. Other Tools** (Postman Codegen, Newman)

- Full TypeScript support
- Adapts to single/microservices patterns
- Professional test structure (Jest + SuperTest)
- Version controlled, CI/CD ready

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need detailed examples?** See [`Agent Instructions`](.agent/AGENT_INSTRUCTIONS.md) for complete pattern library and troubleshooting.
