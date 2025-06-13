# BodyFuel

A full-stack e-commerce solution for dietary supplements and fitness products built with Next.js, Express, and Prisma.

## Project Overview

BodyFuel is a modern e-commerce platform built as a monorepo using Turborepo with three main applications:

1. **Shop** - Customer-facing storefront built with Next.js
2. **Admin** - Administrative dashboard for product and order management
3. **Backend** - Express API server powering both frontend applications

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- ShadCN UI Components
- Auth.js for authentication
- TanStack Query for data fetching & caching
- TanStack Table for admin tables
- React Hook Form for form handling

### Backend

- Express web framework
- Prisma ORM
- PostgreSQL database
- Feature-based architecture pattern

### Infrastructure

- AWS S3 for image storage
- Vercel for frontend hosting (planned)
- Render for backend hosting (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bodyfuel
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Copy example environment files
cp apps/admin/.env.example apps/admin/.env
cp apps/backend/.env.example apps/backend/.env
cp apps/shop/.env.example apps/shop/.env
```

4. Fill in the environment files with your actual credentials and settings.

### Development

To start the development servers for all apps:

```bash
npm run dev
```

To start a specific app:

```bash
npm run dev --workspace=apps/shop
```

### Demo Credentials

For testing purposes, you can use the following admin credentials to access both the admin dashboard and shop application:

**Admin User:**

- Email: `admin@example.com`
- Password: `Admin12345!`

This account has full administrative privileges and can be used to:

- Access the admin dashboard at `/admin`
- Test admin features in the shop application
- Manage products, orders, and other administrative tasks

### Building Packages

When making changes to shared packages, you need to build them:

```bash
# Build a specific package
npm run build --workspace=packages/shared

# Build all packages
npm run build
```

## Project Structure

```
apps/
  ├── admin/       # Admin dashboard
  ├── backend/     # Express API server
  └── shop/        # Customer-facing storefront
packages/
  ├── database/    # Shared database logic (Prisma models)
  ├── shared/      # Shared utilities and code
  ├── ui/          # Shared UI components
  ├── nextjs-config/ # Shared Next.js configuration
  └── typescript-config/ # Shared TypeScript configuration
docs/              # Project documentation
```

## Architecture

The project follows a hybrid architecture combining both layered and feature-based patterns. For more details, see [Architecture Patterns](docs/architecture-patterns.md).

## API Endpoints

The backend exposes RESTful API endpoints for products, categories, collections, cart management, orders, and authentication. For a complete list of endpoints, refer to [Project Overview](docs/project-overview.md).

## Documentation

For more detailed information about the project:

- [Project Overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
