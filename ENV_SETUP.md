# Environment Variables Setup

## Database Configuration

Create a `.env.local` file in the root directory with the following:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
```

### How to get your Supabase connection string:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **Connection pooling**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. The connection string should include `?pgbouncer=true` for connection pooling

### Example:

```
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:your-password-here@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Note:** The `.env.local` file is gitignored and will not be committed to version control.
