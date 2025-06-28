# Authentication System

## Overview

Hybrid auth system with Auth.js + custom endpoints. Supports OAuth (Google) and email/password.

**Components:**

- `@repo/auth` - Shared config
- `/api/auth` - Custom endpoints
- Express middleware - Session validation
- Frontend components - UI

## Package Structure

### Auth Package (`@repo/auth`)

```
packages/auth/src/
├── index.ts                 # Main exports
├── configs/
│   ├── auth.config.ts      # Auth.js providers & settings
│   └── cookie.config.ts    # Cookie configuration
├── express/
│   └── index.ts            # Express-specific auth config
├── schema/
│   └── authSchema.ts       # Zod validation schemas
├── server/
│   └── auth.ts             # Server-side Auth.js setup
├── services/
│   └── authService.ts      # API client for auth endpoints
└── types/
    └── next-auth.ts        # TypeScript type extensions
```

### Key Files Explained

#### `configs/auth.config.ts`

Defines Auth.js providers and core configuration:

- **Google OAuth Provider**: For social login
- **Credentials Provider**: For email/password login
- **Provider Configuration**: Client IDs, secrets, etc.

#### `express/index.ts`

Shared configuration for Express middleware:

- **Session Strategy**: JWT-based sessions
- **Callbacks**: Token and session customization
- **Security Settings**: HTTPS, cookies, CORS

#### `server/auth.ts`

Main Auth.js setup that adapts based on environment:

- **Backend Mode**: Uses Prisma adapter for database sessions
- **Frontend Mode**: Uses JWT strategy only
- **Handlers Export**: For Next.js API routes

#### `types/next-auth.ts`

TypeScript module augmentation:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      role: PrismaUser["role"];
    } & DefaultSession["user"];
  }
  interface User {
    role: PrismaUser["role"];
  }
}
```

## Backend Implementation

### Custom Auth Routes

Located in `apps/backend/src/features/auth/`:

#### Registration Endpoint (`POST /api/auth/signup`)

```typescript
async signup(req: Request, res: Response) {
  const { name, email, password } = req.body;

  // Validate input
  // Check if user exists
  // Hash password
  // Create user in database
  // Return user data
}
```

#### Sign-in Endpoint (`POST /api/auth/signin`)

```typescript
async signin(req: Request, res: Response) {
  const { email, password } = req.body;

  // Find user by email
  // Verify password
  // Return user data (used by Auth.js)
}
```

### Authentication Middleware

#### `authenticatedUser` Middleware

- **Purpose**: Validates any authenticated user
- **Usage**: Protects routes requiring login
- **Validation**: Checks session exists and has valid email

#### `authenticatedAdmin` Middleware

- **Purpose**: Validates admin users only
- **Usage**: Protects admin-only routes
- **Validation**: Checks session exists AND user role is "ADMIN"

Both middleware use the shared `expressAuthConfig`:

```typescript
import { expressAuthConfig } from "@repo/auth/express";
import { getSession } from "@auth/express";

const session = await getSession(req, expressAuthConfig);
```

## Frontend Implementation

### Next.js Integration

Each frontend app has an Auth.js route handler:

```typescript
// apps/admin/src/app/api/auth/[...nextauth]/route.tsx
// apps/shop/src/app/api/auth/[...nextauth]/route.tsx
import { handlers } from "@repo/auth/server";
export const { GET, POST } = handlers;
```

### Authentication Components

Located in `packages/ui/src/components/features/auth/`:

#### `SignIn.tsx`

- **Credentials Form**: Email/password input
- **OAuth Buttons**: Google sign-in (shop only)
- **Admin Support**: Special admin-only mode
- **Session Handling**: Redirects on successful auth

#### `SignUp.tsx`

- **Registration Form**: Name, email, password
- **API Integration**: Calls `/api/auth/signup`
- **Validation**: Zod schema validation
- **Success Handling**: Redirects to dashboard

#### `SignOut.tsx`

- **Sign-out Logic**: Calls Auth.js signOut
- **Cleanup**: Clears session and redirects

### Session Management

```typescript
// Using session in components
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "authenticated") {
  // User is logged in
  console.log(session.user.email);
  console.log(session.user.role);
}
```

## Security Features

### Password Security

- **Hashing**: bcrypt with salt rounds (10)
- **Validation**: Zod schema validation
- **No Plain Text**: Passwords never stored in plain text

### Session Security

- **JWT Strategy**: Stateless session tokens
- **Secure Cookies**: HTTPS-only in production
- **Domain Sharing**: Cookies shared across subdomains
- **CSRF Protection**: Built-in CSRF token handling

### Cookie Configuration

```typescript
export const getCookieConfig = () => ({
  sessionToken: {
    name:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? ".bodyfuel.dennisvaga.com"
          : undefined,
    },
  },
});
```

### Role-Based Access Control (RBAC)

#### User Roles

- **USER**: Standard customer access
- **ADMIN**: Full administrative access

#### Protection Levels

1. **Public Routes**: No authentication required
2. **User Routes**: Any authenticated user
3. **Admin Routes**: Admin role required

```typescript
// Route protection examples
app.use("/api/orders", authenticatedUser); // User level
app.use("/api/admin", authenticatedAdmin); // Admin level
```

## Environment Configuration

### Required Environment Variables

```env
# Auth.js Core
AUTH_SECRET=your_auth_secret_here

# Google OAuth (optional)
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# Database
DATABASE_URL=your_database_connection_string

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Development vs Production

**Development:**

- HTTP cookies allowed
- Relaxed CORS settings
- Debug logging enabled

**Production:**

- HTTPS-only cookies
- Strict CORS policy
- Domain-specific cookies
- Secure headers

## API Endpoints Reference

### Public Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication (internal)

### Protected Endpoints (User Level)

- `GET /api/orders/user` - User's orders
- `POST /api/orders` - Create order

### Protected Endpoints (Admin Level)

- `GET /api/admin/products` - Admin product management
- `GET /api/admin/orders` - All orders management
- `POST /api/admin/collections` - Collection management

## Error Handling

### Authentication Errors

- **401 Unauthorized**: No valid session
- **403 Forbidden**: Insufficient permissions
- **409 Conflict**: User already exists (signup)
- **400 Bad Request**: Invalid input data

### Error Response Format

```typescript
{
  success: false,
  message: "Descriptive error message"
}
```

## Testing Authentication

### Manual Testing Checklist

1. **Registration Flow**

   - [ ] New user can register
   - [ ] Duplicate email rejected
   - [ ] Password requirements enforced

2. **Sign-in Flow**

   - [ ] Valid credentials accepted
   - [ ] Invalid credentials rejected
   - [ ] Session created successfully

3. **OAuth Flow**

   - [ ] Google sign-in works
   - [ ] User profile populated
   - [ ] Account linking works

4. **Authorization**

   - [ ] User routes accessible to users
   - [ ] Admin routes blocked for users
   - [ ] Admin routes accessible to admins

5. **Session Management**
   - [ ] Session persists across requests
   - [ ] Sign-out clears session
   - [ ] Session expires appropriately

## Troubleshooting

### Common Issues

#### "Module not found" Errors

- Ensure auth package is built: `pnpm --filter @repo/auth build`
- Check package exports in `package.json`

#### Session Not Persisting

- Verify `AUTH_SECRET` is set
- Check cookie domain configuration
- Ensure CORS credentials are enabled

#### OAuth Errors

- Verify Google OAuth credentials
- Check redirect URI configuration
- Ensure correct callback URLs

#### Type Errors

- Import types: `import "@repo/auth/types"`
- Rebuild auth package after type changes
- Check TypeScript path mappings

### Debug Commands

```bash
# Build auth package
pnpm --filter @repo/auth build

# Build backend
pnpm --filter backend build

# Check for type errors
pnpm --filter backend run type-check

# View session debug logs
# Check browser console and server logs
```

## Best Practices

### Security

1. **Always hash passwords** before storing
2. **Use HTTPS in production** for secure cookies
3. **Validate all inputs** with Zod schemas
4. **Implement rate limiting** for auth endpoints
5. **Log authentication attempts** for security monitoring

### Code Organization

1. **Centralize auth config** in shared package
2. **Use TypeScript** for type safety
3. **Separate concerns** (auth logic vs business logic)
4. **Consistent error handling** across all routes
5. **Document all auth flows** and configurations

### Performance

1. **Use JWT for stateless sessions** to reduce database load
2. **Cache user roles** in session tokens
3. **Optimize database queries** in auth middleware
4. **Use connection pooling** for database connections

## Migration Guide

### From Basic Auth to This System

1. **Install Dependencies**

   ```bash
   pnpm add next-auth @auth/express @auth/prisma-adapter
   ```

2. **Set Up Auth Package**

   - Create auth package structure
   - Configure providers and callbacks
   - Set up TypeScript types

3. **Update Database Schema**

   - Add Auth.js required tables
   - Add user role fields
   - Run migrations

4. **Implement Middleware**

   - Create authentication middleware
   - Replace existing auth checks
   - Update route protection

5. **Update Frontend**
   - Install Auth.js React components
   - Replace login/logout components
   - Update session handling

This authentication system provides a robust, scalable foundation for your application's security needs while maintaining flexibility for future enhancements.
