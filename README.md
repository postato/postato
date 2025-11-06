# API Testing Template

> **TypeScript + SuperTest** framework for converting Postman collections into version-controlled, programmatic API test suites.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-green)](https://jestjs.io/)
[![SuperTest](https://img.shields.io/badge/SuperTest-7.0-orange)](https://github.com/visionmedia/supertest)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Environment Configuration](#environment-configuration)
- [For AI Agents](#for-ai-agents)
- [Contributing](#contributing)

---

## 🎯 Overview

This template provides a **migration path from Postman to code-based API testing**. It establishes a structured framework where Postman collections are converted into:

- ✅ TypeScript test suites (Jest)
- ✅ Reusable request wrappers (SuperTest)
- ✅ Static test fixtures (JSON)
- ✅ JSON schemas for response validation
- ✅ Multi-environment configurations

**Perfect for QA teams** looking to version control their API tests and integrate them into CI/CD pipelines.

---

## ✨ Features

- 🚀 **TypeScript-first** - Full type safety and IntelliSense
- 📁 **Mirrors Postman structure** - Familiar folder organization
- 🔐 **Authentication support** - Bearer token, API key, OAuth2
- 🌍 **Multi-environment** - Dev, Staging, Production configs
- ✅ **Schema validation** - Automatic JSON schema validation with AJV
- 🧪 **Comprehensive testing** - Happy paths + error scenarios
- 📊 **Coverage reports** - Built-in test coverage tracking
- 🤖 **AI-friendly** - Designed for agent-based code generation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A Postman collection (v2.1 format)

### Installation

1. **Clone or use this template:**
   ```bash
   git clone <repository-url>
   cd api-testing-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your actual values
   ```

4. **Add your Postman collection:**
   ```bash
   # Place your exported collection in:
   postman/v1/postman_collection.json
   ```

5. **Generate tests from Postman collection:**
   - **Option A**: Use an AI agent (read `AGENT_INSTRUCTIONS.md`)
   - **Option B**: Manually create tests following the examples in `src/tests/`

6. **Run tests:**
   ```bash
   npm test
   ```

---

## 📁 Project Structure

```
api-testing-template/
│
├── postman/                          # Postman collections (versioned)
│   ├── v1/
│   │   └── postman_collection.json  # Your exported collection
│   └── current -> v1                 # Symlink to active version
│
├── src/
│   ├── config/                       # Configuration files
│   │   ├── environments/             # Environment-specific configs
│   │   │   ├── dev.env.ts
│   │   │   ├── staging.env.ts
│   │   │   ├── prod.env.ts
│   │   │   └── index.ts
│   │   └── auth.config.ts            # Authentication configuration
│   │
│   ├── fixtures/                     # Static test data (from Postman examples)
│   │   ├── authentication/
│   │   ├── products/
│   │   └── users/
│   │
│   ├── requests/                     # SuperTest request wrappers
│   │   ├── authentication/
│   │   ├── products/
│   │   └── users/
│   │
│   ├── tests/                        # Jest test suites
│   │   ├── authentication/
│   │   ├── products/
│   │   └── users/
│   │
│   ├── schemas/                      # JSON schemas for validation
│   │   ├── authentication/
│   │   ├── products/
│   │   └── users/
│   │
│   ├── utils/                        # Utility functions
│   │   ├── auth-helper.ts            # Authentication helpers
│   │   ├── request-builder.ts        # Request building utilities
│   │   ├── schema-validator.ts       # JSON schema validation
│   │   └── assertion-helpers.ts      # Custom assertion helpers
│   │
│   └── types/                        # TypeScript type definitions
│       └── index.ts
│
├── .env.example                      # Environment variables template
├── .env.development                  # Local development config (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json                     # TypeScript configuration
├── jest.config.js                    # Jest configuration
├── AGENT_INSTRUCTIONS.md             # 🤖 Complete guide for AI agents
└── README.md                         # This file
```

---

## 💻 Usage

### Example Test Structure

**Postman Request:**
```
Collection: "E-commerce API"
└── Products
    └── Get Product By ID
```

**Generated Files:**
```typescript
// src/tests/products/get-product-by-id.test.ts
describe('Products - Get Product By ID', () => {
  it('should return product details', async () => {
    const response = await getProductById(authToken, 1);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});

// src/requests/products/get-product-by-id.request.ts
export const getProductById = async (authToken: string, productId: number) => {
  const config = getConfig();
  return request(config.baseUrl)
    .get(`/api/products/${productId}`)
    .set('Authorization', `Bearer ${authToken}`);
};
```

### Writing Your First Test

1. **Create a request wrapper** in `src/requests/[folder]/`:
   ```typescript
   import request from 'supertest';
   import { getConfig } from '../../config/environments';

   export const getUsers = async (authToken: string) => {
     const config = getConfig();
     return request(config.baseUrl)
       .get('/api/users')
       .set('Authorization', `Bearer ${authToken}`);
   };
   ```

2. **Create a test file** in `src/tests/[folder]/`:
   ```typescript
   import { authHelper } from '../../utils/auth-helper';
   import { getUsers } from '../../requests/users/get-users.request';

   describe('Users - Get All Users', () => {
     let authToken: string;

     beforeAll(async () => {
       authToken = await authHelper.getToken();
     });

     it('should return list of users', async () => {
       const response = await getUsers(authToken);
       expect(response.status).toBe(200);
       expect(Array.isArray(response.body.items)).toBe(true);
     });
   });
   ```

3. **Run the test:**
   ```bash
   npm test
   ```

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Type checking (no test execution)
npm run type-check
```

### Environment-Specific Testing

```bash
# Run tests against development environment
npm run test:dev

# Run tests against staging environment
npm run test:staging

# Run tests against production environment
npm run test:prod
```

### Running Specific Tests

```bash
# Run tests in a specific file
npx jest src/tests/products/get-all-products.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="should return product"

# Run tests in a specific folder
npx jest src/tests/authentication/
```

---

## ⚙️ Environment Configuration

### Multiple Environments

The framework supports three environments by default:

| Environment | Config File | Base URL (default) |
|------------|-------------|-------------------|
| **Development** | `src/config/environments/dev.env.ts` | `https://api.dev.example.com` |
| **Staging** | `src/config/environments/staging.env.ts` | `https://api.staging.example.com` |
| **Production** | `src/config/environments/prod.env.ts` | `https://api.example.com` |

### Switching Environments

Set the `TEST_ENV` environment variable:

```bash
# Via command line
TEST_ENV=staging npm test

# Or in .env.development
TEST_ENV=staging
```

### Environment Variables

Copy `.env.example` to `.env.development` and configure:

```env
# Test Environment
TEST_ENV=dev

# Development
DEV_BASE_URL=https://api.dev.example.com
DEV_API_KEY=your_dev_api_key

# Staging
STAGING_BASE_URL=https://api.staging.example.com
STAGING_API_KEY=your_staging_api_key

# Authentication
AUTH_USERNAME=test@example.com
AUTH_PASSWORD=password123
```

---

## 🤖 For AI Agents

### If you're an AI agent working on this project:

👉 **Read `AGENT_INSTRUCTIONS.md` first!**

That document contains:
- Complete code generation patterns
- Folder structure mapping rules
- Step-by-step workflow
- Full examples for every file type
- Edge case handling

**Quick summary for agents:**
1. Parse `postman/v1/postman_collection.json`
2. Extract auth config, variables, and request structure
3. For each request, generate:
   - Test file (`src/tests/[folder]/[name].test.ts`)
   - Request wrapper (`src/requests/[folder]/[name].request.ts`)
   - Fixtures (`src/fixtures/[folder]/[name]-*.json`)
   - Schema (`src/schemas/[folder]/[name]-response.schema.json`)
4. Maintain exact folder hierarchy from Postman
5. Follow naming conventions (kebab-case for files, camelCase for functions)

---

## 📝 Examples Included

The template includes working examples:

- ✅ **Authentication**: Login test with Bearer token
- ✅ **GET request**: Paginated product list
- ✅ **POST request**: Create product with validation
- ✅ **Schema validation**: JSON schema validation examples
- ✅ **Error handling**: 401, 404, 400 error scenarios
- ✅ **Fixtures**: Request/response JSON examples

**Location:** `src/tests/`, `src/requests/`, `src/fixtures/`, `src/schemas/`

---

## 🔐 Authentication

### Supported Auth Types

- **Bearer Token** (default)
- **API Key**
- **OAuth2**
- **Basic Auth**

### Auth Configuration

Update `src/config/auth.config.ts`:

```typescript
export const authConfig: AuthConfig = {
  type: 'bearer',
  tokenEndpoint: '/api/auth/login',
  credentials: {
    username: process.env.AUTH_USERNAME || '',
    password: process.env.AUTH_PASSWORD || '',
  },
};
```

### Using Auth in Tests

```typescript
import { authHelper } from '../../utils/auth-helper';

let authToken: string;

beforeAll(async () => {
  authToken = await authHelper.getToken(); // Cached automatically
});

it('should access protected endpoint', async () => {
  const response = await request(config.baseUrl)
    .get('/api/protected')
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
});
```

---

## 🛠️ Utilities

### Schema Validator

```typescript
import { validateSchema } from '../../utils/schema-validator';
import schema from '../../schemas/users/get-user-response.schema.json';

const isValid = validateSchema(response.body, schema);
expect(isValid).toBe(true);
```

### Assertion Helpers

```typescript
import { assertionHelpers } from '../../utils/assertion-helpers';

assertionHelpers.hasFields(response.body, ['id', 'name', 'email']);
assertionHelpers.validPagination(response.body);
assertionHelpers.responseTime(startTime, 1000); // Max 1 second
```

### Request Builder

```typescript
import { buildGetRequest, buildPostRequest } from '../../utils/request-builder';

const response = await buildGetRequest('/api/users', authToken);
const createResponse = await buildPostRequest('/api/users', userData, authToken);
```

---

## 🔄 Version Control

### Updating Postman Collections

When your API changes:

1. Export new Postman collection
2. Create a new version folder:
   ```bash
   mkdir postman/v2
   cp new_collection.json postman/v2/postman_collection.json
   ```
3. Update symlink:
   ```bash
   ln -sf v2 postman/current
   ```
4. Regenerate tests from new collection

This preserves history and makes rollback easy.

---

## 🧩 Best Practices

1. **Keep Postman organized**: Use clear folder names and request names
2. **Add response examples**: Include examples in Postman for schema generation
3. **Environment separation**: Never commit production credentials
4. **Test isolation**: Each test should be independent
5. **Use beforeAll**: Authenticate once per test suite, not per test
6. **Schema validation**: Always validate response structure
7. **Error scenarios**: Test both success and failure cases

---

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:staging
        env:
          STAGING_BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          STAGING_API_KEY: ${{ secrets.STAGING_API_KEY }}
```

---

## 🤝 Contributing

1. Follow the existing folder structure
2. Add tests for new features
3. Update schemas when response structure changes
4. Keep `AGENT_INSTRUCTIONS.md` in sync with patterns
5. Use TypeScript strict mode

---

## 📚 Additional Resources

- [SuperTest Documentation](https://github.com/visionmedia/supertest)
- [Jest Documentation](https://jestjs.io/)
- [Postman Collection Format](https://schema.postman.com/)
- [JSON Schema Specification](https://json-schema.org/)

---

## 📄 License

MIT License - feel free to use this template for your projects!

---

## 💡 Tips & Tricks

### Quick Test Creation

```bash
# Copy example test as template
cp src/tests/products/get-all-products.test.ts src/tests/orders/get-orders.test.ts
# Modify for your endpoint
```

### Debugging Failed Tests

```bash
# Run single test with full output
npx jest --verbose --no-coverage src/tests/products/create-product.test.ts
```

### Schema Generation

Use online tools to generate schemas from JSON:
- [JSON Schema Generator](https://www.jsonschema.net/)
- [Transform.tools](https://transform.tools/json-to-json-schema)

---

## ❓ FAQ

**Q: Can I use this without Postman?**  
A: Yes! Follow the examples in `src/tests/` to create tests manually.

**Q: How do I handle file uploads?**  
A: Use SuperTest's `.attach()` method. See [SuperTest docs](https://github.com/visionmedia/supertest).

**Q: Can I test GraphQL APIs?**  
A: Yes, but you'll need to adapt the request wrappers for GraphQL queries.

**Q: How do I mock external dependencies?**  
A: Use Jest's mocking features: `jest.mock()` for modules.

---

**Built with ❤️ for QA teams transitioning from Postman to code-based testing.**

For AI agents: See `AGENT_INSTRUCTIONS.md` for complete generation patterns.
