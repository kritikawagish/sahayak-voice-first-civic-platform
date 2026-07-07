# Sahayak: Voice-First Civic Platform

A voice-first platform for civic governance, complaints management, and government scheme applications built with Next.js, PostgreSQL, and Drizzle ORM.

## Features

- **Voice-First Interface**: Citizens can interact through voice commands
- **Scheme Applications**: Easy application submission for government schemes
- **Complaint Management**: Register and track civic complaints
- **Official Dashboard**: For officials to manage applications and complaints
- **Multi-language Support**: Hindi and English support

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/kritikawagish/sahayak-voice-first-civic-platform.git
cd sahayak-voice-first-civic-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Update `.env.local` with your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/sahayak_db
```

### 4. Set up the database

#### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL container
- Apply database migrations
- Start the Next.js development server

#### Option B: Manual setup
```bash
# Create PostgreSQL database
createdb sahayak_db

# Run migrations
npx drizzle-kit push

# Seed sample data
npm run seed
```

### 5. Start development server
```bash
npm run dev
```

Visit http://localhost:3000

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Database migrations
npx drizzle-kit push          # Apply migrations
npx drizzle-kit drop          # Drop all tables
npx drizzle-kit generate      # Generate migration files
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── applications/  # Application management
│   │   ├── complaints/    # Complaint management
│   │   ├── health/        # Health check
│   │   ├── official/      # Official dashboard
│   │   ├── proxy/         # Proxy management
│   │   └── schemes/       # Schemes listing
│   ├── citizen/           # Citizen portal
│   ├── official/          # Official dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Hero.tsx          # Hero section
│   ├── Impact.tsx        # Impact section
│   ├── Navbar.tsx        # Navigation bar
│   └── GooeyNav/         # Animated navigation
├── db/                    # Database layer
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts           # Database seeding
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## API Endpoints

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/[ref]` - Get application by reference number
- `PATCH /api/applications/[ref]` - Update application

### Complaints
- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - File new complaint

### Schemes
- `GET /api/schemes` - List available schemes

### Officials
- `GET /api/official` - Official dashboard data
- `POST /api/official` - Officer actions

### Health
- `GET /api/health` - Health check endpoint

## Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import the repository
   - Add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string

3. **Deploy**
   - Vercel will automatically build and deploy on push to main

### Docker Deployment

Build the image:
```bash
docker build -t sahayak:latest .
```

Run the container:
```bash
docker run -e DATABASE_URL=postgresql://... -p 3000:3000 sahayak:latest
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

## Troubleshooting

### Build Fails with "DATABASE_URL is required"
- Ensure DATABASE_URL is set in deployment environment
- For local builds, use `.env.local` file

### Database Connection Errors
- Verify PostgreSQL is running: `psql -U postgres`
- Check connection string format
- Ensure database exists: `createdb sahayak_db`

### Migration Errors
```bash
# Drop and recreate
npx drizzle-kit drop
npx drizzle-kit push
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
