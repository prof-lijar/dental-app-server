# dental-app-server
Back End Server for dental app project

## Project Structure

This project follows the **MVC (Model-View-Controller)** architecture pattern:

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
├── views/                 # React components (if needed)
├── utils/                 # Utility functions
│   └── response.ts        # API response helpers
├── package.json
├── tsconfig.json
└── next.config.js
```

## Architecture

- **Models** (`/models`): Define data structures, types, and schemas
- **Controllers** (`/controllers`): Handle business logic and prepare data for API responses
- **Views** (`/app`): React components and pages (Next.js App Router)
- **API Routes** (`/app/api`): REST API endpoints that use controllers

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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
