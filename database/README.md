# Database Setup

This project uses PostgreSQL (Supabase) with the `pg` (node-postgres) driver for full control over database queries.

## Connection Pooling

The database connection uses a connection pool that:

- Opens a connection when needed
- Executes the query
- Closes/releases the connection back to the pool

This is handled automatically by the `executeQuery` function in `utils/db.ts`.

## Setup Instructions

1. **Get your Supabase connection string:**

   - Go to your Supabase project
   - Navigate to Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - It should look like: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true`

2. **Create `.env.local` file:**

   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
   ```

3. **Run migrations:**
   - Go to Supabase SQL Editor
   - Run the SQL files from `database/migrations/` folder
   - Or create your own tables

## Repository Pattern

The repository pattern is similar to Spring Boot:

- **BaseRepository**: Provides common CRUD operations
- **Custom Repositories**: Extend BaseRepository and add custom query methods
- **Controllers**: Use repositories to access data

### Example Usage

```typescript
// In a repository
export class UserRepository extends BaseRepository<User> {
  protected tableName = "users";
  protected primaryKey = "id";

  // Custom query
  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1 LIMIT 1`;
    const result = await this.executeQuery<User>(query, [email]);
    return result.rows[0] || null;
  }
}

// In a controller
const repository = new UserRepository();
const user = await repository.findById("123");
```

## Direct SQL Queries

You have full control and can write raw PostgreSQL queries:

```typescript
const repository = new UserRepository();
const result = await repository.executeQuery(
  `SELECT u.*, p.name as profile_name 
   FROM users u 
   LEFT JOIN profiles p ON u.id = p.user_id 
   WHERE u.status = $1`,
  ["active"]
);
```

## Transactions

Use transactions for multiple related operations:

```typescript
await repository.executeTransaction(async (client) => {
  await client.query("INSERT INTO users ...");
  await client.query("INSERT INTO profiles ...");
  // Both will commit or rollback together
});
```
