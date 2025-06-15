# BodyFuel

A full-stack e-commerce solution for fitness supplements built with Next.js, Express, and Prisma.

## Project Overview

BodyFuel is a modern fitness supplements e-commerce platform built as a monorepo using Turborepo. We specialize in high-quality supplements to fuel your fitness journey with three main applications:

1. **Shop** - Customer-facing storefront built with Next.js
2. **Admin** - Administrative dashboard for product and order management
3. **Backend** - Express API server powering both frontend applications

### Product Categories

- **Pre-Workout** - Energy and performance boosters
- **Post-Workout** - Recovery and muscle building supplements
- **Protein Powders** - Whey, casein, and plant-based proteins
- **Creatine** - Strength and power enhancement
- **Vitamins** - Essential nutrients and health support
- **Fat Burners** - Weight management and metabolism support

## Key Features

- **AI-Powered Product Chat** - Real-time product discovery with streaming responses
- **Product Variants** - Support for different flavors, sizes, and formulations
- **Admin Dashboard** - Complete product, inventory, and order management
- **Secure Authentication** - OAuth (Google) and email/password authentication
- **Business Overview Dashboard** - Key metrics and business insights
- **Real-time Inventory** - Live stock tracking and management
- **Responsive Design** - Optimized for desktop and mobile shopping

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- ShadCN UI Components (customized with `text-base` instead of `text-sm`)
- Auth.js for authentication
- TanStack Query for data fetching & caching
- TanStack Table for admin tables
- React Hook Form for form handling

### Backend

- Express web framework
- Prisma ORM with PostgreSQL
- Feature-based architecture pattern
- Vercel AI SDK for chatbot functionality
- DeepSeek AI for product recommendations

### Infrastructure

- AWS S3 for product image storage
- Vercel for frontend hosting (planned)
- PostgreSQL database

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bodyfuel
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Copy example environment files
cp apps/admin/.env.example apps/admin/.env
cp apps/backend/.env.example apps/backend/.env
cp apps/shop/.env.example apps/shop/.env
```

4. Configure your environment files with:
   - Database connection string
   - Auth.js secret and Google OAuth credentials
   - AWS S3 credentials for image uploads
   - AI API keys for chatbot functionality

### Development

To start all development servers:

```bash
pnpm run dev
```

To start a specific app:

```bash
pnpm run dev --filter=apps/shop      # Customer storefront
pnpm run dev --filter=apps/admin     # Admin dashboard
pnpm run dev --filter=apps/backend   # API server
```

### Demo Credentials

For testing purposes, use these admin credentials:

**Admin User:**

- Email: `admin@example.com`
- Password: `Admin12345!`

This account provides access to:

- Admin dashboard for product management
- Order processing and inventory control
- Business overview dashboard with key metrics

### Building Packages

When making changes to shared packages, build them first:

```bash
# Build a specific package
pnpm run build --filter=packages/shared

# Build all packages
pnpm run build
```

## Project Structure

```
apps/
  ├── admin/       # Admin dashboard for supplement management
  ├── backend/     # Express API server
  └── shop/        # Customer storefront
packages/
  ├── auth/        # Authentication system (Auth.js + custom endpoints)
  ├── config/      # Shared configuration packages
  │   ├── nextjs-config/     # Next.js configuration
  │   ├── tailwind-config/   # Tailwind CSS configuration
  │   └── typescript-config/ # TypeScript configuration
  ├── database/    # Prisma models and database logic
  ├── platform-utils/ # Platform-specific utilities
  ├── shared/      # Shared utilities and business logic
  └── ui/          # Shared UI components (ShadCN-based)
docs/              # Comprehensive project documentation
```

## Architecture

The project follows a **feature-based architecture** pattern, organizing code by business capabilities rather than technical layers:

- **Frontend**: Feature-based structure inspired by Bulletproof React
- **Backend**: Feature-based with controllers, services, and repositories
- **Authentication**: Hybrid Auth.js + custom endpoints with role-based access
- **AI Chat**: Real-time product streaming with Vercel AI SDK

For detailed architecture information, see [Architecture Documentation](docs/architecture.md).

## Key API Endpoints

### Products & Categories

- `GET /api/products` - Browse supplement catalog
- `GET /api/categories` - Fitness supplement categories
- `GET /api/collections` - Curated supplement collections

### Shopping & Orders

- `POST /api/cart` - Add supplements to cart
- `POST /api/orders` - Place supplement orders
- `GET /api/orders/user` - Order history

### AI Chat

- `POST /api/chat` - AI-powered product discovery
- Real-time product streaming for instant results

### Authentication

- `POST /api/auth/signup` - Customer registration
- OAuth integration with Google
- Role-based access (Customer/Admin)

## Documentation

Comprehensive documentation available:

- [Project Overview](docs/project-overview.md) - Complete project details
- [Architecture](docs/architecture.md) - System architecture and patterns
- [Authentication](docs/authentication.md) - Auth system implementation
- [Chatbot](docs/chatbot.md) - AI chat functionality
- [Product Model](docs/product-model-diagram.md) - Database relationships
