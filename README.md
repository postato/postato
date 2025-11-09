# API Testing Template

> Zero-code migration from Postman to TypeScript test suites

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-green)](https://jestjs.io/)
[![SuperTest](https://img.shields.io/badge/SuperTest-7.0-orange)](https://github.com/visionmedia/supertest)

---

## 🎯 What This Is

A template that transforms Postman collections into production-ready TypeScript test suites:

1. Export your Postman collection → Drop it in `postman/v1/`
2. Configure architecture/auth patterns → Edit `src/config/template.config.ts`
3. Paste `AGENT_INSTRUCTIONS.md` into AI agent → Provide your Postman JSON
4. AI generates 47+ files → Run `npm test`

---

## 🤖 For AI-Powered Test Generation

**This is the PRIMARY workflow.** If you're using an AI agent (Claude, ChatGPT, etc.):

**Prompt example:**
```
I have a Postman collection for our e-commerce API. 
Please read AGENT_INSTRUCTIONS.md and generate the complete test suite.

[Paste your postman_collection.json contents]
```

**The AI agent will generate:**
- ✅ `src/tests/**/*.test.ts` - Jest test suites
- ✅ `src/requests/**/*.request.ts` - SuperTest wrappers
- ✅ `src/fixtures/**/*.fixture.ts` - Test data
- ✅ `src/schemas/**/*.schema.ts` - JSON schemas
- ✅ All organized by Postman folder structure

**Key files for AI agents:**
- `AGENT_INSTRUCTIONS.md` (1,400+ lines) - Complete generation guide
- `src/config/template.config.ts` - Feature flags (architecture/auth patterns)
- `src/utils/` - Pre-built helpers that AI-generated code uses

**Result:** Zero manual test writing. AI reads your API contracts, generates everything.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repository-url> && cd api-testing-template
npm install

# 2. Configure environment
cp .env.example .env.development
# Edit .env.development with your API URLs and credentials

# 3. Drop your Postman collection
cp your_collection.json postman/v1/postman_collection.json

# 4. Configure template patterns (edit src/config/template.config.ts)
# Set: ARCHITECTURE (single/microservices), AUTH_PATTERN (single/multiple), sslEnabled (true/false)

# 5. Generate tests with AI agent
# Paste AGENT_INSTRUCTIONS.md + your collection into Claude/ChatGPT

# 6. Run tests
npm test
```

---

## 📁 Project Structure

```
api-testing-template/
│
├── postman/
│   └── v1/
│       ├── postman_collection.json          # Your Postman collection (place here)
│       └── *.postman_environment.json       # Optional: environment exports
│
├── certs/                                    # Optional: SSL certificates
│   └── README.md                            # Certificate instructions
│
├── src/
│   ├── config/
│   │   ├── template.config.ts               # 🔧 Configure architecture/auth patterns
│   │   ├── auth.config.ts                   # Authentication settings
│   │   └── environments/                    # Dev/staging/prod configs
│   │
│   ├── tests/                               # 🤖 AI-generated Jest test suites
│   ├── requests/                            # 🤖 AI-generated SuperTest wrappers
│   ├── fixtures/                            # 🤖 AI-generated test data
│   ├── schemas/                             # 🤖 AI-generated JSON schemas
│   │
│   └── utils/                               # Template utilities (pre-built)
│       ├── auth-helper.ts                   # Authentication (adapts to config)
│       ├── request-builder.ts               # Request building (adapts to config)
│       ├── schema-validator.ts              # JSON schema validation
│       └── assertion-helpers.ts             # Custom assertions
│
├── AGENT_INSTRUCTIONS.md                    # 🤖 Complete guide for AI agents
├── .env.example                             # Environment variables template
└── README.md                                # This file
```

**Files you touch:**
- `postman/v1/postman_collection.json` - Your Postman export
- `src/config/template.config.ts` - Architecture/auth pattern settings
- `.env.development` - Environment-specific variables

**Files AI generates:**
- Everything in `src/tests/`, `src/requests/`, `src/fixtures/`, `src/schemas/`

---

## ⚙️ Configuration

### Template Configuration (`src/config/template.config.ts`)

```typescript
export const TEMPLATE_CONFIG = {
  architecture: ARCHITECTURE.SINGLE,   // or MICROSERVICES
  authPattern: AUTH_PATTERN.SINGLE,    // or MULTIPLE
  sslEnabled: false,                   // or true
};
```

**All utilities auto-adapt** based on these flags. No code commenting/uncommenting required.

### Environment Variables (`.env.development`)

```env
# Test Environment
TEST_ENV=dev

# Single API
DEV_BASE_URL=https://api.dev.example.com
DEV_API_KEY=your_dev_api_key

# Microservices (if ARCHITECTURE.MICROSERVICES)
DEV_MAIN_API_URL=https://api.dev.example.com
DEV_PAYMENTS_API_URL=https://payments.dev.example.com
DEV_NOTIFICATIONS_API_URL=https://notifications.dev.example.com

# Multiple Tokens (if AUTH_PATTERN.MULTIPLE)
DEV_ADMIN_TOKEN=
DEV_SERVICE_ACCOUNT_TOKEN=
DEV_CLIENT_TOKEN=

# SSL (if sslEnabled is true)
DEV_SSL_ENABLED=false
DEV_SSL_CERT_PATH=certs/dev-ca.crt

# Authentication
AUTH_USERNAME=test@example.com
AUTH_PASSWORD=password123
```

### Switching Environments

```bash
TEST_ENV=staging npm test
TEST_ENV=prod npm test
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
npm test -- products

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

---

## 🔐 Authentication

The template handles authentication automatically based on your `template.config.ts` settings:

```typescript
// Single token (default) - automatically cached and reused
const response = await request.get('/users/me');

// Multiple tokens - specify which service
const response = await request.get('/payments/history', { serviceType: 'payments' });
```

Auth tokens are automatically:
- Fetched on first request
- Cached for subsequent requests  
- Refreshed when expired
- Scoped per service (if using multiple auth)

**Configuration** is in `src/config/auth.config.ts` and auto-adapts to your `AUTH_PATTERN` setting.

---

## 📝 Example Test (AI-Generated)

**Postman Request:**
```
Collection: "E-commerce API"
└── Products
    └── Get Product By ID
```

**Generated Test:**
```typescript
// src/tests/products/get-product-by-id.test.ts
import { request } from '../../utils/request-builder';
import { validateSchema } from '../../utils/schema-validator';
import productSchema from '../../schemas/products/product.schema';

describe('Products - Get Product By ID', () => {
  it('should return product details', async () => {
    const response = await request.get('/products/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    validateSchema(response.body, productSchema);
  });
});
```

---

## 📦 What's Included

- **Type-safe requests** - TypeScript + SuperTest wrappers
- **JSON Schema validation** - Auto-validates API responses
- **Dynamic configuration** - Adapts to single/microservices architectures
- **Smart authentication** - Auto-caching with single/multiple token patterns
- **SSL support** - Custom certificates for dev/staging
- **Environment switching** - Dev/staging/prod via `TEST_ENV`
- **Detailed reporting** - Jest test results with coverage
- **AI-ready** - Full `AGENT_INSTRUCTIONS.md` for zero-code generation

---

## 🔄 Updating Collections

When your Postman collection changes:

1. Export new `postman_collection.json` to `postman/v1/`
2. Run AI agent with prompt: "Update test suite for modified Postman collection"
3. Agent compares old vs new, generates only changed files

See `AGENT_INSTRUCTIONS.md` Section 10 for AI update workflow.

---

## 📚 Documentation

- **`AGENT_INSTRUCTIONS.md`** - Complete guide for AI agents (1,400+ lines)
- **`certs/README.md`** - SSL certificate setup
- **`postman/v1/README.md`** - Postman collection examples

---

## 🎯 Key Concepts

**Zero-Code Workflow**: Drop your Postman collection, let AI read `AGENT_INSTRUCTIONS.md`, generate 47+ files, run tests. No manual test writing required.

**Feature Flags**: `template.config.ts` controls everything. Set `ARCHITECTURE: 'single'` or `'microservices'`, `AUTH_PATTERN: 'single'` or `'multiple'`, and all utilities adapt automatically.

**Smart Utilities**: Every helper (`auth-helper.ts`, `request-builder.ts`, `schema-validator.ts`) reads `template.config.ts` at runtime and adjusts behavior. AI-generated code stays simple.

**Override Strategy**: When regenerating tests, AI uses `REPLACE` mode (deletes old file, writes new one). No merging. Prevents drift and conflicts.

---

**Need help?** Paste `AGENT_INSTRUCTIONS.md` into your AI agent and ask it to generate tests from your Postman collection.
