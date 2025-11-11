# AI Agent Instructions - Postato Test Completion

**Your Job:** Fill TODO markers in generated test files. That's it.

The CLI has generated 100% complete request wrappers and test skeletons. You're adding assertions and edge cases.

---

## Quick Start

### 1. Find TODOs

```bash
grep -r "TODO:" src/tests/
```

You'll see:

```
src/tests/products/create-product.spec.ts:16:  it('TODO: should return created', async () => {
src/tests/products/create-product.spec.ts:17:    // TODO: Replace placeholder values
src/tests/products/create-product.spec.ts:21:    // TODO: Add response body assertions
src/tests/products/create-product.spec.ts:28:  // TODO: Add more test cases
```

### 2. Complete Each Test File

For each file with TODOs:

1. Replace `TODO:` in test names
2. Add realistic test data
3. Add response body assertions
4. Add edge case tests (400, 404, etc.)

### 3. Run Tests

```bash
npm test
```

Fix any failures, done.

---

## What Gets Generated (CLI Output)

**Request wrappers** - ✅ 100% complete, don't touch these:

```typescript
// src/requests/products/create-product.request.ts
export const createProduct = async (authToken: string, body: any) => {
  return createRequest()
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${authToken}`)
    .send(body)
}
```

**Test skeletons** - 🔄 Your job, fill TODOs:

```typescript
// src/tests/products/create-product.spec.ts
describe('POST /api/v1/products', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await authHelper.getToken()
  })

  it('TODO: should create product', async () => {
    const response = await createProduct(authToken, {}) // ← Empty placeholder
    expect(response.status).toBe(201)
    // TODO: Add response body assertions  // ← Your job
  })

  it('should return 401 for invalid token', async () => {
    const response = await createProduct('invalid_token', {})
    expect(response.status).toBe(401)
  })

  // TODO: Add more test cases  // ← Your job
})
```

---

## Pattern Library

### Pattern 1: Replace Placeholder Data

**Before:**

```typescript
it('TODO: should create product', async () => {
  const response = await createProduct(authToken, {}) // ❌ Empty
  expect(response.status).toBe(201)
  // TODO: Add response body assertions
})
```

**After:**

```typescript
it('should create product successfully', async () => {
  const productData = {
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Electronics',
    inStock: true,
  }

  const response = await createProduct(authToken, productData)

  expect(response.status).toBe(201)
  expect(response.body).toHaveProperty('id')
  expect(response.body.name).toBe('Wireless Mouse')
  expect(response.body.price).toBe(29.99)
  expect(typeof response.body.id).toBe('string')
})
```

---

### Pattern 2: Add Response Body Assertions

**Levels of validation:**

```typescript
// Level 1: Properties exist
expect(response.body).toHaveProperty('id')
expect(response.body).toHaveProperty('name')
expect(response.body).toHaveProperty('createdAt')

// Level 2: Type validation
expect(typeof response.body.id).toBe('string')
expect(typeof response.body.price).toBe('number')
expect(typeof response.body.inStock).toBe('boolean')

// Level 3: Value validation
expect(response.body.name).toBe('Wireless Mouse')
expect(response.body.price).toBeGreaterThan(0)
expect(response.body.status).toBe('active')

// Level 4: Array validation
expect(Array.isArray(response.body.tags)).toBe(true)
expect(response.body.tags.length).toBeGreaterThan(0)
```

**For list endpoints:**

```typescript
it('should return list of products', async () => {
  const response = await getAllProducts(authToken, 1, 10)

  expect(response.status).toBe(200)
  expect(Array.isArray(response.body)).toBe(true)
  expect(response.body.length).toBeGreaterThan(0)

  // Validate first item structure
  expect(response.body[0]).toHaveProperty('id')
  expect(response.body[0]).toHaveProperty('name')
  expect(response.body[0]).toHaveProperty('price')
})
```

**For paginated endpoints:**

```typescript
it('should return paginated products', async () => {
  const response = await getAllProducts(authToken, 1, 10)

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('items')
  expect(response.body).toHaveProperty('total')
  expect(response.body).toHaveProperty('page')
  expect(Array.isArray(response.body.items)).toBe(true)
  expect(response.body.items.length).toBeLessThanOrEqual(10)
})
```

---

### Pattern 3: Add Edge Case Tests

CLI generates only 2 tests. You add the rest:

```typescript
describe('POST /api/v1/products', () => {
  // ✅ CLI-generated success test (you fill details)
  it('should create product successfully', async () => {
    /* ... */
  })

  // ✅ CLI-generated 401 test (already complete)
  it('should return 401 for invalid token', async () => {
    /* ... */
  })

  // ❌ You must add these:

  it('should return 400 for missing required fields', async () => {
    const response = await createProduct(authToken, {
      price: 99.99, // Missing 'name'
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('should return 400 for invalid data types', async () => {
    const response = await createProduct(authToken, {
      name: 'Test',
      price: 'not-a-number', // Wrong type
    })

    expect(response.status).toBe(400)
  })

  it('should return 400 for negative price', async () => {
    const response = await createProduct(authToken, {
      name: 'Test',
      price: -10,
    })

    expect(response.status).toBe(400)
  })

  it('should return 409 for duplicate name', async () => {
    await createProduct(authToken, { name: 'Unique Product', price: 99 })
    const response = await createProduct(authToken, {
      name: 'Unique Product',
      price: 99,
    })

    expect(response.status).toBe(409)
  })
})
```

**Edge cases by HTTP method:**

| Method          | Required Edge Cases                                  |
| --------------- | ---------------------------------------------------- |
| **POST**        | 400 missing fields, 400 invalid types, 409 duplicate |
| **GET (by ID)** | 404 not found                                        |
| **GET (list)**  | Empty results, invalid query params                  |
| **PUT/PATCH**   | 404 not found, 400 invalid data                      |
| **DELETE**      | 404 not found                                        |

---

### Pattern 4: Add Setup/Cleanup (Only When Needed)

**When you need setup:**

- GET by ID (need to create the resource first)
- UPDATE (need existing resource)
- DELETE (need existing resource)

**When you DON'T need setup:**

- POST (creates new resource)
- GET list (works on existing data)

**Example:**

```typescript
describe('GET /api/v1/products/:id', () => {
  let authToken: string
  let testProductId: string

  beforeAll(async () => {
    authToken = await authHelper.getToken()

    // Setup: Create test product
    const createResponse = await createProduct(authToken, {
      name: 'Test Product',
      price: 99.99,
    })
    testProductId = createResponse.body.id
  })

  afterAll(async () => {
    // Cleanup: Delete test product
    if (testProductId) {
      await deleteProduct(authToken, testProductId)
    }
  })

  it('should return product by ID', async () => {
    const response = await getProductById(authToken, testProductId)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(testProductId)
    expect(response.body.name).toBe('Test Product')
  })

  it('should return 404 for non-existent ID', async () => {
    const response = await getProductById(authToken, 'non-existent-id')
    expect(response.status).toBe(404)
  })
})
```

---

### Pattern 5: Dynamic Test Data (For Unique Constraints)

If API requires unique values (emails, usernames, names):

```typescript
it('should create user with unique email', async () => {
  const uniqueEmail = `test-${Date.now()}@example.com`

  const response = await createUser(authToken, {
    email: uniqueEmail,
    name: 'Test User',
  })

  expect(response.status).toBe(201)
  expect(response.body.email).toBe(uniqueEmail)
})
```

---

## Architecture-Aware Patterns

The template supports 2 architectures. Your code adapts automatically.

### Single Architecture (Default)

```typescript
// Config: ARCHITECTURE.SINGLE
beforeAll(async () => {
  authToken = await authHelper.getToken() // Returns single token
})

it('should work', async () => {
  // createRequest() uses config.baseUrl automatically
  const response = await endpoint(authToken, data)
  expect(response.status).toBe(200)
})
```

### Microservices Architecture

```typescript
// Config: ARCHITECTURE.MICROSERVICES
beforeAll(async () => {
  // If AUTH_PATTERN.SINGLE - same as above
  authToken = await authHelper.getToken()

  // If AUTH_PATTERN.MULTIPLE - specify token type
  adminToken = await authHelper.getToken(TEMPLATE_CONFIG.tokenTypes.ADMIN)
  clientToken = await authHelper.getToken(TEMPLATE_CONFIG.tokenTypes.CLIENT)
})

it('should work', async () => {
  // createRequest() uses service-specific URL automatically
  const response = await endpoint(authToken, data)
  expect(response.status).toBe(200)
})
```

**You don't need to check config.** The utilities handle it. Write tests the same way regardless of architecture.

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoded IDs

```typescript
// BAD - ID may not exist
it('should get product', async () => {
  const response = await getProductById(authToken, '12345')
  expect(response.status).toBe(200)
})
```

```typescript
// GOOD - Create test data first
let testId: string

beforeAll(async () => {
  const createResponse = await createProduct(authToken, testData)
  testId = createResponse.body.id
})

it('should get product', async () => {
  const response = await getProductById(authToken, testId)
  expect(response.status).toBe(200)
})
```

---

### ❌ Mistake 2: Empty Test Data

```typescript
// BAD - Empty object
const response = await createProduct(authToken, {})
```

```typescript
// GOOD - Realistic data
const response = await createProduct(authToken, {
  name: 'Wireless Mouse',
  price: 29.99,
  category: 'Electronics',
})
```

---

### ❌ Mistake 3: Only Status Checks

```typescript
// BAD - Not enough validation
expect(response.status).toBe(200)
```

```typescript
// GOOD - Validate body structure
expect(response.status).toBe(200)
expect(response.body).toHaveProperty('id')
expect(response.body).toHaveProperty('name')
expect(typeof response.body.id).toBe('string')
expect(response.body.name).toBe('Wireless Mouse')
```

---

### ❌ Mistake 4: Missing Edge Cases

```typescript
// BAD - Only happy path
describe('Create Product', () => {
  it('should create product', async () => {
    /* ... */
  })
  it('should return 401 for invalid token', async () => {
    /* ... */
  })
})
```

```typescript
// GOOD - Comprehensive coverage
describe('Create Product', () => {
  it('should create product', async () => {
    /* ... */
  })
  it('should return 401 for invalid token', async () => {
    /* ... */
  })
  it('should return 400 for missing fields', async () => {
    /* ... */
  })
  it('should return 400 for invalid types', async () => {
    /* ... */
  })
  it('should return 409 for duplicate', async () => {
    /* ... */
  })
})
```

---

## Troubleshooting

### Issue: Tests Fail with "Cannot read property 'services' of undefined"

**Cause:** Missing `.env.development` or environment not loaded

**Solution:**

```bash
# Check if .env file exists
ls -la .env.*

# Verify TEST_ENV is set
cat .env.development | grep TEST_ENV
```

---

### Issue: Test Timeout

**Cause:** API is slow or endpoint hangs

**Solution:**

```typescript
it('should handle slow endpoint', async () => {
  const response = await slowEndpoint(authToken)
  expect(response.status).toBe(200)
}, 60000) // 60 second timeout
```

---

### Issue: Schema Import Fails

**Symptom:**

```typescript
import productSchema from '../../schemas/products/product.schema.json'
// Error: Cannot find module
```

**Solution:** CLI doesn't generate schemas. Skip schema validation:

```typescript
// Instead of schema validation:
// expect(schemaValidator.validate(response.body, productSchema)).toBe(true);

// Use manual assertions:
expect(response.body).toHaveProperty('id')
expect(response.body).toHaveProperty('name')
expect(typeof response.body.id).toBe('string')
```

---

## Completion Checklist

Before finishing, verify:

- [ ] All `TODO:` comments removed
- [ ] All test names complete (no `TODO:` prefix)
- [ ] All tests use realistic data (no empty `{}` or placeholder IDs)
- [ ] All success tests validate response body (not just status)
- [ ] Each test suite has 4-6 tests minimum (success + edge cases)
- [ ] Tests requiring existing data have `beforeAll` setup
- [ ] Tests that create data have `afterAll` cleanup
- [ ] `npm test` passes without errors

---

## Quick Reference

**What CLI generates:**

- Request wrappers: ✅ Complete, don't touch
- Test skeletons: 🔄 2 basic tests with TODOs
- Config files: ✅ Complete, don't touch
- Utilities: ✅ Complete, don't touch

**Your tasks:**

1. Replace `TODO:` in test names
2. Add realistic test data
3. Add response body assertions
4. Add 3-4 more edge case tests per suite
5. Add setup/cleanup where needed

**Target:** 4-6 tests per endpoint

**Time estimate:** 5-15 minutes for 50 test files

---

**That's it.** The hard work is done. You're adding the finishing touches.
