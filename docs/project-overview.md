# Project Documentation

## Technologies Used

### Frontend

- Next.js (using app route)
- ShadCN (UI components)
  - **Note:** All ShadCN components should use `text-base` instead of the default `text-sm`
- Auth.js (Authentication)

### Backend

- Express (Web framework)
- Prisma ORM (Database ORM)
- PostgreSQL (Database)

### Libraries

- Tanstack Query (Data fetching & caching)
- Tanstack Table (Table management)
- React Hook Form (Form handling)

### Hosting/Infrastructure

- Vercel (Deployment platform - not hosted yet)
- AWS S3 (Image hosting)

---

## Development Workflow

### Package Changes

When making changes to shared packages (like `@repo/shared`, `@repo/database`, etc.), you must build the packages for the changes to be reflected in the apps:

```bash
# Build a specific package
pnpm run build --filter=packages/shared

# Build all packages
pnpm run build
```

This is necessary because the packages are compiled and then imported by the apps. Without building, the apps will continue to use the old version of the package.

### Common Development Tasks

- Start the development server for all apps: `pnpm run dev`
- Start a specific app: `pnpm run dev --filter=apps/shop`
- Run tests: `pnpm run test`
- Lint code: `pnpm run lint`

---

## Project Structure

The web app is a Turborepo with 3 apps:

1. **Backend** - Express API for server-side logic
2. **Admin** - UI to manage products, collections, inventory, and orders
3. **Shop** - The frontend for customer-facing pages

### Shared Packages:

- **Database** - Shared database logic and queries (Prisma models, etc.)
- **Shared** - Shared utilities, components, and code between apps
- **UI** - Shared UI components (such as buttons, modals, etc.)
- **nextjs-config** - Shared Next.js configuration for Admin & Shop apps
- **typescript-config** - Shared TypeScript configuration for all apps and packages

---

## Project Architecture

### Frontend Architecture (Admin & Shop)

- **Feature-based architecture** following the Bulletproof React pattern from GitHub
  - Code organized by business features rather than technical layers
  - Each feature contains its own components, hooks, utils, and types
  - For detailed information, see [frontend-architecture.md](./frontend-architecture.md)

### Backend Architecture

- **Feature-based architecture** organizing code by business capabilities
  - All features follow a consistent structure with controllers, services, and repositories
  - Each feature is self-contained with clear boundaries
  - For detailed information, see [architecture.md](./architecture.md)

### State Management

- React Context + TanStack Query for caching the fetched server-side data.

### Cart Context

- To avoid duplication, product data is fetched only in the product context and then pulled using the `productId` stored in `cartItem`.

---

## Compilation strategies:

shared: Compiled package
database Package: Compiled package
ui: Just-in-time package.

## Module systems:

NOTE: shared package using NodeNext to stay compatible for both next apps (ESNext) + express (NodeNext).

### Apps:

Admin: ESNext
Shop: ESNext
Express: NodeNext

### Packages

ui: ESNext
shared: NodeNext
databse: NodeNext

---

## API Endpoints

### Product Routes

- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch a single product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product details
- `DELETE /api/products/:id` - Delete a product

### Category Routes

- `GET /api/categories` - Fetch all categories
- `GET /api/categories/:id` - Fetch a single category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update category details
- `DELETE /api/categories/:id` - Delete a category

### Collection Routes

- `GET /api/collections` - Fetch all collections
- `GET /api/collections/:id` - Fetch a single collection
- `POST /api/collections` - Create a new collection
- `PUT /api/collections/:id` - Update collection details
- `DELETE /api/collections/:id` - Delete a collection

### Cart Routes

- `GET /api/cart` - Fetch cart items
- `POST /api/cart` - Add an item to the cart
- `PUT /api/cart/:id` - Update a cart item
- `DELETE /api/cart/:id` - Remove an item from the cart

### Order Routes

- `GET /api/orders` - Fetch all orders
- `GET /api/orders/:id` - Fetch a single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order details
- `DELETE /api/orders/:id` - Delete an order

### Auth Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

---
