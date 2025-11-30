# dental-app-server

Back End Server for dental app project

## Project Structure

This project follows the **MVC (Model-View-Controller)** architecture pattern with **Repository Pattern** for database access:

```
dental-app-server/
├── app/                    # Next.js App Router
│   ├── api/               # REST API routes
│   │   └── example/       # Example API endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── models/                # Data models, types, schemas
│   └── index.ts           # Model definitions
├── controllers/           # Business logic layer
│   └── example.controller.ts
├── repositories/          # Data access layer (Repository Pattern)
│   ├── base.repository.ts # Base repository with CRUD operations
│   └── example.repository.ts
├── database/              # Database migrations and setup
│   ├── migrations/        # SQL migration files
│   └── README.md          # Database setup guide
├── config/                # Configuration files
│   └── database.ts        # Database initialization
├── utils/                 # Utility functions
│   ├── db.ts              # Database connection pool
│   └── response.ts        # API response helpers
├── views/                 # React components (if needed)
├── package.json
├── tsconfig.json
└── next.config.js
```

## Architecture

- **Models** (`/models`): Define data structures, types, and schemas
- **Repositories** (`/repositories`): Data access layer with full SQL control (similar to Spring Boot repositories)
- **Controllers** (`/controllers`): Handle business logic and prepare data for API responses
- **Views** (`/app`): React components and pages (Next.js App Router)
- **API Routes** (`/app/api`): REST API endpoints that use controllers

## Database Setup

This project uses **PostgreSQL (Supabase)** with the `pg` (node-postgres) driver for full control over database queries. Connection pooling is handled automatically (open → execute → close).

### Quick Setup

1. **Create `.env.local` file:**

   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
   ```

   Get your connection string from Supabase: Settings → Database → Connection pooling

2. **Run migrations:**
   - Go to Supabase SQL Editor
   - Run SQL files from `database/migrations/` folder

See `database/README.md` for detailed database setup instructions.

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

   - Create `.env.local` file
   - Add your Supabase `DATABASE_URL` (see Database Setup above)

3. **Run the development server:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## API Endpoints

Example API endpoint: `/api/example`

- `GET /api/example?id=123` - Get example by ID
- `POST /api/example` - Create new example
- `PUT /api/example` - Update example
- `DELETE /api/example?id=123` - Delete example

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
