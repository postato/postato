# API Testing Template - Agent Instructions

## 🎯 What This Project Is

This is a **TypeScript + SuperTest API testing framework** that converts Postman collections into version-controlled, programmatic test suites. This file is the **SINGLE SOURCE OF TRUTH** for AI agents working on this project.

**Project Identity:**
- **Framework**: SuperTest (HTTP assertions library)
- **Language**: TypeScript
- **Test Runner**: Jest
- **Input Format**: Postman Collection v2.1 JSON
- **Output**: Structured test files mirroring Postman folder hierarchy
- **Purpose**: Migration from Postman collections to code-based API testing

---

## 🤖 Your Role as an Agent

When a user provides a `postman_collection.json` file, you will:

1. ✅ Parse the collection structure
2. ✅ Extract all configuration (auth, variables, base URLs)
3. ✅ Generate TypeScript test files, fixtures, and schemas
4. ✅ Maintain exact folder hierarchy from Postman
5. ✅ Create environment-specific configurations
6. ✅ Generate reusable request wrappers

**DO NOT:**
- ❌ Create duplicate documentation files
- ❌ Deviate from the folder structure patterns
- ❌ Skip schema generation if response examples exist
- ❌ Convert Postman pre-request or test scripts (we skip these)
- ❌ Assume folder names - use exact Postman folder names converted to kebab-case

---

## 📥 Input: Postman Collection

### Expected Location
```
postman/v{X}/postman_collection.json
```
Where `{X}` is the version number (v1, v2, v3, etc.)

### Collection Structure You'll Encounter
```json
{
  "info": {
    "name": "Collection Name",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": { ... },           // Collection-level auth
  "variable": [ ... ],       // Collection variables
  "item": [                  // Folders and requests
    {
      "name": "Folder Name",
      "item": [ ... ]        // Nested requests or sub-folders
    }
  ]
}
```

### Key Elements to Extract

| Element | Purpose | Target Location |
|---------|---------|-----------------|
| `info.name` | Test suite naming | Used in describe blocks |
| `auth` | Authentication config | `src/config/auth.config.ts` |
| `variable` | Environment variables | `.env.example` and env configs |
| `item` | Folder/request hierarchy | Entire `src/` structure |
| `request.url.raw` | API endpoints | Request wrappers and tests |
| `request.header` | Default headers | Request wrapper functions |
| `response` | Example responses | Fixtures and JSON schemas |

---

## 📁 Folder Structure Mapping

### Rule: **Mirror Postman Exactly**

**Postman Collection Structure:**
```
Collection: "E-commerce API"
├── Authentication/
│   ├── Login
│   └── Logout
├── Products/
│   ├── CRUD/
│   │   ├── Create Product
│   │   └── Get Product
│   └── Search Products
└── Users/
    └── Get User Profile
```

**Generated Project Structure:**
```
src/
├── tests/
│   ├── authentication/
│   │   ├── login.test.ts
│   │   └── logout.test.ts
│   ├── products/
│   │   ├── crud/
│   │   │   ├── create-product.test.ts
│   │   │   └── get-product.test.ts
│   │   └── search-products.test.ts
│   └── users/
│       └── get-user-profile.test.ts
│
├── requests/
│   ├── authentication/
│   │   ├── login.request.ts
│   │   └── logout.request.ts
│   ├── products/
│   │   ├── crud/
│   │   │   ├── create-product.request.ts
│   │   │   └── get-product.request.ts
│   │   └── search-products.request.ts
│   └── users/
│       └── get-user-profile.request.ts
│
├── fixtures/
│   ├── authentication/
│   │   ├── login-request.json
│   │   ├── login-response.json
│   │   └── ...
│   ├── products/
│   │   └── crud/
│   │       └── ...
│   └── users/
│       └── ...
│
└── schemas/
    ├── authentication/
    │   └── login-response.schema.json
    ├── products/
    │   └── crud/
    │       └── ...
    └── users/
        └── ...
```

### Naming Conventions

| Type | Pattern | Examples |
|------|---------|----------|
| **Folders** | lowercase, hyphen-separated (kebab-case) | `authentication/`, `products/crud/` |
| **Test Files** | `[name].test.ts` | `login.test.ts`, `create-product.test.ts` |
| **Request Files** | `[name].request.ts` | `login.request.ts`, `get-user-profile.request.ts` |
| **Request Fixtures** | `[name]-request.json` | `login-request.json`, `create-product-request.json` |
| **Response Fixtures** | `[name]-response.json` | `login-response.json`, `get-all-products-response.json` |
| **Schemas** | `[name]-response.schema.json` | `login-response.schema.json` |

### Transformation Examples

| Postman Request Name | Test File | Request File |
|---------------------|-----------|--------------|
| `Get User Profile` | `get-user-profile.test.ts` | `get-user-profile.request.ts` |
| `Create Order` | `create-order.test.ts` | `create-order.request.ts` |
| `Delete Item (Admin)` | `delete-item-admin.test.ts` | `delete-item-admin.request.ts` |
| `Login` | `login.test.ts` | `login.request.ts` |

---

## 🔨 Code Generation Patterns

### Pattern 1: Test File Generation

**Given Postman Request:**
```json
{
  "name": "Get Product By ID",
  "request": {
    "method": "GET",
    "header": [
      { "key": "Authorization", "value": "Bearer {{authToken}}" }
    ],
    "url": {
      "raw": "{{baseUrl}}/api/products/{{productId}}",
      "path": ["api", "products", "{{productId}}"]
    }
  },
  "response": [
    {
      "name": "Product Found",
      "status": "OK",
      "code": 200,
      "body": "{\"id\": 1, \"name\": \"Laptop\", \"price\": 999.99}"
    }
  ]
}
```

**Generate: `src/tests/products/get-product-by-id.test.ts`**
```typescript
/**
 * Get Product By ID Test Suite
 * Generated from Postman collection: Products > Get Product By ID
 */

import { authHelper } from '../../utils/auth-helper';
import { getProductById } from '../../requests/products/get-product-by-id.request';
import { validateSchema } from '../../utils/schema-validator';
import getProductByIdResponseSchema from '../../schemas/products/get-product-by-id-response.schema.json';

describe('Products - Get Product By ID', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await authHelper.getToken();
  });

  it('should return product details successfully', async () => {
    const productId = 1;

    const response = await getProductById(authToken, productId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');

    // Schema validation
    expect(validateSchema(response.body, getProductByIdResponseSchema)).toBe(true);

    // Business logic assertions
    expect(response.body.id).toBe(productId);
    expect(typeof response.body.name).toBe('string');
    expect(typeof response.body.price).toBe('number');
  });

  it('should return 404 for non-existent product', async () => {
    const productId = 99999;

    const response = await getProductById(authToken, productId);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const productId = 1;

    const response = await getProductById('invalid_token', productId);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
```

**Key Elements in Test Files:**
- ✅ Import SuperTest utilities and helpers
- ✅ Import request wrapper from `requests/` layer
- ✅ Import schema from `schemas/` layer
- ✅ Extract path/query parameters from URL
- ✅ Use `authHelper.getToken()` if auth is required
- ✅ Include schema validation if response examples exist
- ✅ Write at least 2-3 tests: happy path + error cases
- ✅ Use descriptive test names following pattern: "should [expected behavior]"
- ✅ Add JSDoc comment indicating Postman source

---

### Pattern 2: Request Wrapper Generation

**From Same Postman Request, Generate:**

**`src/requests/products/get-product-by-id.request.ts`**
```typescript
/**
 * Get Product By ID Request Wrapper
 * Generated from Postman collection: Products > Get Product By ID
 */

import request from 'supertest';
import { getConfig } from '../../config/environments';

/**
 * Get product details by ID
 * @param authToken - Authentication token
 * @param productId - Product ID
 * @returns SuperTest response
 */
export const getProductById = async (authToken: string, productId: number) => {
  const config = getConfig();
  
  return request(config.baseUrl)
    .get(`/api/products/${productId}`)
    .set('Authorization', `Bearer ${authToken}`);
};
```

**Key Elements in Request Wrappers:**
- ✅ Import SuperTest and environment config
- ✅ Export async function matching request name (camelCase)
- ✅ Extract dynamic URL parameters as function arguments
- ✅ Use `getConfig()` for base URL
- ✅ Set headers from Postman request
- ✅ Return SuperTest response (don't call `.expect()` here)
- ✅ Add JSDoc documentation
- ✅ Use TypeScript types for parameters

---

### Pattern 3: Fixture Generation

**From Postman Request Body:**
```json
{
  "request": {
    "body": {
      "mode": "raw",
      "raw": "{\"name\": \"Laptop\", \"price\": 999.99}"
    }
  }
}
```

**Generate: `src/fixtures/products/create-product-request.json`**
```json
{
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics",
  "inStock": true
}
```

**From Postman Response Example:**
```json
{
  "response": [
    {
      "name": "Success Response",
      "code": 200,
      "body": "{\"id\": 1, \"name\": \"Laptop\", \"price\": 999.99, \"createdAt\": \"2025-01-01T00:00:00Z\"}"
    }
  ]
}
```

**Generate: `src/fixtures/products/create-product-response.json`**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Fixture Generation Rules:**
- ✅ Parse Postman's `body.raw` field (usually stringified JSON)
- ✅ Extract first 2xx response example for response fixtures
- ✅ Use actual values from Postman examples
- ✅ Pretty-print JSON (2-space indentation)
- ✅ If multiple responses exist, use the first successful one

---

### Pattern 4: JSON Schema Generation

**From Response Body:**
```json
{
  "id": 1,
  "name": "Laptop",
  "email": "user@example.com",
  "createdAt": "2025-01-01T00:00:00Z",
  "isActive": true,
  "metadata": {
    "region": "US",
    "tier": "premium"
  }
}
```

**Generate: `src/schemas/users/get-user-response.schema.json`**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email", "createdAt", "isActive"],
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    },
    "isActive": {
      "type": "boolean"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "region": {
          "type": "string"
        },
        "tier": {
          "type": "string"
        }
      }
    }
  }
}
```

**Schema Generation Rules:**
- ✅ Use JSON Schema draft-07
- ✅ Analyze response body structure and infer types
- ✅ Mark all top-level fields as `required` (unless obviously optional)
- ✅ Detect formats: `email`, `date-time`, `uri`, etc.
- ✅ Handle nested objects recursively
- ✅ For arrays, define `items` schema
- ✅ Add descriptions where helpful

**Type Inference Table:**

| Value Example | JSON Schema Type | Format (if applicable) |
|--------------|------------------|------------------------|
| `123` | `number` | - |
| `"text"` | `string` | - |
| `true` | `boolean` | - |
| `"user@example.com"` | `string` | `email` |
| `"2025-01-01T00:00:00Z"` | `string` | `date-time` |
| `"https://example.com"` | `string` | `uri` |
| `[1, 2, 3]` | `array` | `items: { type: "number" }` |
| `{ "key": "value" }` | `object` | - |

---

## ⚙️ Environment Configuration

### Extracting Variables from Postman

**Postman Collection Variables:**
```json
{
  "variable": [
    { "key": "baseUrl", "value": "https://api.dev.example.com" },
    { "key": "apiKey", "value": "dev_key_123" },
    { "key": "timeout", "value": "5000" }
  ]
}
```

**Generated Files:**

**1. `src/config/environments/dev.env.ts`**
```typescript
export const devConfig = {
  baseUrl: process.env.DEV_BASE_URL || 'https://api.dev.example.com',
  apiKey: process.env.DEV_API_KEY || '',
  timeout: 5000,
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export type EnvironmentConfig = typeof devConfig;
```

**2. `src/config/environments/staging.env.ts`**
```typescript
export const stagingConfig = {
  baseUrl: process.env.STAGING_BASE_URL || 'https://api.staging.example.com',
  apiKey: process.env.STAGING_API_KEY || '',
  timeout: 10000,
  retryAttempts: 2,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

**3. `src/config/environments/prod.env.ts`**
```typescript
export const prodConfig = {
  baseUrl: process.env.PROD_BASE_URL || 'https://api.example.com',
  apiKey: process.env.PROD_API_KEY || '',
  timeout: 15000,
  retryAttempts: 1,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

**4. `.env.example`**
```env
# Test Environment Selector
TEST_ENV=dev

# Development Environment
DEV_BASE_URL=https://api.dev.example.com
DEV_API_KEY=

# Staging Environment
STAGING_BASE_URL=https://api.staging.example.com
STAGING_API_KEY=

# Production Environment
PROD_BASE_URL=https://api.example.com
PROD_API_KEY=

# Authentication
AUTH_USERNAME=
AUTH_PASSWORD=
```

**Variable Mapping:**

| Postman Variable | Environment Config | .env Variable |
|-----------------|-------------------|---------------|
| `{{baseUrl}}` | `config.baseUrl` | `DEV_BASE_URL`, `STAGING_BASE_URL`, `PROD_BASE_URL` |
| `{{apiKey}}` | `config.apiKey` | `DEV_API_KEY`, `STAGING_API_KEY`, `PROD_API_KEY` |
| `{{authToken}}` | Managed by `auth-helper` | N/A (generated at runtime) |

---

## 🔐 Authentication Handling

### Detecting Auth from Postman Collection

**Case 1: Bearer Token Authentication**

**Postman Collection:**
```json
{
  "auth": {
    "type": "bearer",
    "bearer": [
      { "key": "token", "value": "{{authToken}}" }
    ]
  }
}
```

**Generate: `src/config/auth.config.ts`**
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

**The existing `src/utils/auth-helper.ts` already handles Bearer token authentication.**

---

**Case 2: API Key Authentication**

**Postman Collection:**
```json
{
  "auth": {
    "type": "apikey",
    "apikey": [
      { "key": "key", "value": "x-api-key" },
      { "key": "value", "value": "{{apiKey}}" }
    ]
  }
}
```

**Update: `src/config/auth.config.ts`**
```typescript
export const authConfig: AuthConfig = {
  type: 'apikey',
  apiKeyHeader: 'x-api-key',
  apiKeyValue: process.env.API_KEY || '',
};
```

**Update request wrappers to use API key:**
```typescript
.set('x-api-key', config.apiKey)
```

---

**Case 3: No Authentication**

If `auth` is not present or type is `noauth`, skip authentication setup and don't include auth headers in requests.

---

## 📝 Step-by-Step Agent Workflow

### Step 1: Locate Postman Collection
```bash
1. Check for symlink: postman/current/postman_collection.json
2. OR find latest version: postman/v1/, postman/v2/, etc.
3. Parse JSON file
```

### Step 2: Extract Collection Metadata
```typescript
// Parse collection
const collection = JSON.parse(collectionFile);

// Extract info
const collectionName = collection.info.name;
const authConfig = collection.auth;
const variables = collection.variable;

// Generate configurations
→ Update src/config/auth.config.ts based on authConfig
→ Update environment files based on variables
→ Update .env.example with all variables
```

### Step 3: Traverse Collection Items (Recursive)

```typescript
function processItems(items, folderPath = '') {
  for (const item of items) {
    if (item.item) {
      // This is a folder
      const newFolderPath = `${folderPath}/${toKebabCase(item.name)}`;
      processItems(item.item, newFolderPath);
    } else if (item.request) {
      // This is a request
      generateFilesForRequest(item, folderPath);
    }
  }
}
```

### Step 4: Generate Files for Each Request

For each request (e.g., "Get User Profile" in "Users" folder):

1. **Determine paths:**
   ```typescript
   const folderPath = 'users'; // from Postman folder
   const requestName = 'get-user-profile'; // from Postman request name
   
   testFile = `src/tests/${folderPath}/${requestName}.test.ts`
   requestFile = `src/requests/${folderPath}/${requestName}.request.ts`
   requestFixture = `src/fixtures/${folderPath}/${requestName}-request.json`
   responseFixture = `src/fixtures/${folderPath}/${requestName}-response.json`
   responseSchema = `src/schemas/${folderPath}/${requestName}-response.schema.json`
   ```

2. **Extract request details:**
   - HTTP method
   - URL path
   - Headers
   - Query parameters
   - Request body

3. **Extract response examples (if exist):**
   - First 2xx response
   - Parse response body
   - Generate schema

4. **Create all files** following the patterns above

### Step 5: Handle Edge Cases

| Edge Case | Solution |
|-----------|----------|
| No response examples | Skip fixture and schema generation |
| Multiple response examples | Use first 2xx response; create error response fixtures separately |
| Dynamic URL parameters | Extract as function arguments (e.g., `{{userId}}` → `userId: number`) |
| Query parameters | Pass as `params` object in request wrapper |
| Nested folders | Maintain full path depth in folder structure |
| Special characters in names | Convert to valid identifiers (kebab-case for files, camelCase for functions) |

---

## 📋 Quick Reference

### HTTP Method → Test Template

| HTTP Method | Default Test Cases |
|-------------|-------------------|
| `GET` | ✅ Success (200), ❌ Not Found (404), ❌ Unauthorized (401) |
| `POST` | ✅ Created (201), ❌ Bad Request (400), ❌ Unauthorized (401) |
| `PUT` | ✅ Success (200), ❌ Not Found (404), ❌ Bad Request (400) |
| `PATCH` | ✅ Success (200), ❌ Not Found (404), ❌ Bad Request (400) |
| `DELETE` | ✅ No Content (204), ❌ Not Found (404), ❌ Unauthorized (401) |

### File Template Summary

```
For Postman request: "Products > Create Product"

✅ src/tests/products/create-product.test.ts
   → Test suite with describe(), it() blocks
   → Import request wrapper, schema, fixtures
   → Use authHelper.getToken() if auth required
   → Include schema validation
   → 3-5 test cases (happy + error paths)

✅ src/requests/products/create-product.request.ts
   → Export async function
   → Use SuperTest to build request
   → Return response (no assertions)

✅ src/fixtures/products/create-product-request.json
   → Request body from Postman example

✅ src/fixtures/products/create-product-response.json
   → Response body from first 2xx Postman example

✅ src/schemas/products/create-product-response.schema.json
   → JSON Schema generated from response structure
```

---

## 🎓 Complete Example: End-to-End

### Input: Postman Collection Fragment

```json
{
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{authToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Laptop\", \"price\": 999.99, \"category\": \"Electronics\"}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "path": ["api", "products"]
            }
          },
          "response": [
            {
              "name": "Product Created",
              "status": "Created",
              "code": 201,
              "body": "{\"id\": 1, \"name\": \"Laptop\", \"price\": 999.99, \"category\": \"Electronics\", \"createdAt\": \"2025-11-06T10:00:00Z\"}"
            }
          ]
        }
      ]
    }
  ]
}
```

### Output: Generated Files

**File 1: `src/tests/products/create-product.test.ts`**
```typescript
/**
 * Create Product Test Suite
 * Generated from Postman collection: Products > Create Product
 */

import { authHelper } from '../../utils/auth-helper';
import { createProduct } from '../../requests/products/create-product.request';
import { validateSchema } from '../../utils/schema-validator';
import createProductRequestFixture from '../../fixtures/products/create-product-request.json';
import createProductResponseSchema from '../../schemas/products/create-product-response.schema.json';

describe('Products - Create Product', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await authHelper.getToken();
  });

  it('should successfully create a new product', async () => {
    const response = await createProduct(authToken, createProductRequestFixture);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('createdAt');

    // Validate response schema
    expect(validateSchema(response.body, createProductResponseSchema)).toBe(true);

    // Validate data matches request
    expect(response.body.name).toBe(createProductRequestFixture.name);
    expect(response.body.price).toBe(createProductRequestFixture.price);
  });

  it('should return 400 for invalid product data', async () => {
    const invalidProduct = { name: '', price: -10 };

    const response = await createProduct(authToken, invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await createProduct('invalid_token', createProductRequestFixture);

    expect(response.status).toBe(401);
  });
});
```

**File 2: `src/requests/products/create-product.request.ts`**
```typescript
/**
 * Create Product Request Wrapper
 * Generated from Postman collection: Products > Create Product
 */

import request from 'supertest';
import { getConfig } from '../../config/environments';

/**
 * Create a new product
 * @param authToken - Authentication token
 * @param productData - Product data
 * @returns SuperTest response
 */
export const createProduct = async (authToken: string, productData: any) => {
  const config = getConfig();
  
  return request(config.baseUrl)
    .post('/api/products')
    .set('Authorization', `Bearer ${authToken}`)
    .set('Content-Type', 'application/json')
    .send(productData);
};
```

**File 3: `src/fixtures/products/create-product-request.json`**
```json
{
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics"
}
```

**File 4: `src/fixtures/products/create-product-response.json`**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics",
  "createdAt": "2025-11-06T10:00:00Z"
}
```

**File 5: `src/schemas/products/create-product-response.schema.json`**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "price", "category", "createdAt"],
  "properties": {
    "id": { "type": "number" },
    "name": { "type": "string" },
    "price": { "type": "number" },
    "category": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## ✅ Validation Checklist

After generating files from a Postman collection, verify:

- [ ] All Postman folders are mirrored in `src/tests/`, `src/requests/`, `src/fixtures/`, `src/schemas/`
- [ ] File names follow kebab-case convention
- [ ] All test files import correct request wrappers
- [ ] Schema validation is included where response examples exist
- [ ] Auth helper is used for authenticated requests
- [ ] Environment configs contain all Postman variables
- [ ] `.env.example` lists all required environment variables
- [ ] Request wrappers extract dynamic URL parameters as function arguments
- [ ] Test files include both happy path and error cases
- [ ] JSON schemas use draft-07 and have proper required fields

---

## 🚀 Running the Tests

```bash
# Install dependencies first
npm install

# Run all tests (development environment)
npm test

# Run tests for specific environment
npm run test:dev
npm run test:staging
npm run test:prod

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 📌 Important Notes

1. **Authentication tokens** are cached in `auth-helper` to avoid repeated login requests
2. **Environment selection** via `TEST_ENV` environment variable
3. **Schema validation** uses AJV with format support
4. **Request wrappers** don't include assertions - they're just HTTP clients
5. **Fixtures** are static snapshots from Postman examples
6. **Folder structure** must exactly mirror Postman hierarchy

---

## 🎯 Success Criteria

You've successfully converted a Postman collection when:

✅ Every Postman request has a corresponding test file  
✅ Folder structure is identical to Postman  
✅ All tests run without import errors  
✅ Environment configurations are populated  
✅ Schema validation passes for all responses  
✅ Authentication flow works correctly  
✅ Both happy and error paths are tested  

---

**This is your complete guide. Follow these patterns precisely, and you'll generate a perfectly structured, maintainable API test suite from any Postman collection. Good luck! 🚀**
