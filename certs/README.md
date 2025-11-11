# SSL Certificates

## When to Use This Folder

If your API uses:

- Self-signed certificates
- Internal Certificate Authority (CA)
- Custom SSL/TLS certificates

Place your certificate files here.

## Naming Convention

Use environment-specific names:

- `dev-ca.crt` (or `.pem`)
- `staging-ca.crt`
- `prod-ca.crt`

## Configuration

Update your `.env.development`:

```env
DEV_SSL_ENABLED=true
DEV_SSL_CERT_PATH=certs/dev-ca.crt
```

## Security Note

Certificate files are automatically gitignored.
Share certificates through secure channels only.

## Supported Formats

- `.crt` (most common)
- `.pem`
- `.key`

## Example Usage

1. Place your certificate: `certs/dev-ca.crt`
2. Enable in environment file:
   ```env
   DEV_SSL_ENABLED=true
   DEV_SSL_CERT_PATH=certs/dev-ca.crt
   ```
3. Tests will automatically load the certificate via `jest.setup.ts`
