# BodyFuel Architecture

This document outlines the architectural patterns used across the BodyFuel application.

## Frontend Architecture (Admin & Shop)

The frontend applications (Shop and Admin) follow the feature-based architecture pattern inspired by the [Bulletproof React](https://github.com/alan2207/bulletproof-react) approach.

### Directory Structure

```
src/
├── components/       # Shared components used across features
├── config/           # Application configuration
├── features/         # Feature-based code organization
│   ├── auth/         # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── products/     # Products feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── ...
├── hooks/            # Shared hooks
├── lib/              # Shared libraries and integrations
├── providers/        # Context providers
├── services/         # Shared services (API clients, etc.)
├── types/            # Shared TypeScript types
└── utils/            # Shared utility functions
```

### Feature Module Structure

Each feature is organized into its own directory containing all related code:

| Directory   | Purpose                                    |
| ----------- | ------------------------------------------ |
| components/ | UI components specific to the feature      |
| hooks/      | React hooks for state management and logic |
| services/   | API calls and data transformations         |
| types/      | TypeScript type definitions                |
| utils/      | Utility functions specific to the feature  |
| index.ts    | Public API exports from the feature        |

## Backend Architecture

The backend is currently in a **transitional state**, moving from a layered architecture to a fully feature-based architecture. This transition is ongoing, and both patterns currently exist in the codebase.

### Current Hybrid Approach

#### Layered Architecture Pattern (Legacy)

Many parts of the backend still follow a traditional layered architecture:

```
Route → Service → Repository
```

| Layer      | Responsibility                                      |
| ---------- | --------------------------------------------------- |
| Route      | Handle HTTP requests/responses and error handling   |
| Service    | Implement business logic and orchestrate operations |
| Repository | Handle database operations and data access          |

#### Feature-Based Architecture Pattern (Target)

Complex features like the Chat feature already use a feature-based architecture:

```
features/
  feature/
    controllers/  (formerly routes)
    services/
    repositories/
    types/
    utils/
    router.ts
```

Each feature module follows this structure:

| Component     | Responsibility                                        |
| ------------- | ----------------------------------------------------- |
| controllers/  | Handle HTTP requests/responses (equivalent to routes) |
| services/     | Implement business logic                              |
| repositories/ | Handle database operations                            |
| types/        | Define TypeScript types specific to the feature       |
| utils/        | Utility functions specific to the feature             |
| router.ts     | Define and export the feature's routes                |

### Transition Plan

The goal is to migrate all backend code to the feature-based architecture pattern. This transition will:

1. Improve code organization and maintainability
2. Create consistency across the entire codebase
3. Make feature development more self-contained
4. Reduce cross-feature dependencies

New features should be implemented using the feature-based pattern, while existing code will be migrated incrementally.

## Benefits of Feature-Based Architecture

1. **Colocation**

   - Related code is kept together, making it easier to navigate and understand
   - Reduces the need to jump between many directories

2. **Encapsulation**

   - Features are self-contained with clear boundaries
   - Reduces unexpected side effects between features

3. **Scalability**

   - New features can be added without modifying existing ones
   - Teams can work on different features in parallel

4. **Maintainability**

   - Changes to one feature don't affect others
   - Easier to understand the scope and boundaries of each feature

5. **Testability**
   - Features can be tested in isolation
   - Clearer structure makes unit and integration tests easier to write

## Implementation Guidelines

### Feature Organization

1. **Feature Identification**

   - Identify distinct capabilities of the application
   - Create a feature folder for each major capability

2. **Component Structure**

   - Keep components specific to a feature within that feature's directory
   - Extract common components to the shared components directory

3. **Data Flow**
   - Each feature manages its own data fetching and state
   - Share data between features using context providers or query cache

### Code Sharing Between Features

1. **Explicit Exports**

   - Each feature exports specific components/hooks via its index.ts
   - Other features import only what they need, by name

2. **Shared Utilities**

   - Common utilities go in the root utils/ directory
   - Feature-specific utilities stay within the feature

3. **Cross-Feature Communication**
   - Frontend: Use React Context for state that spans features
   - Backend: Use service composition or events for cross-feature communication

## Example: Chat Feature

The Chat feature demonstrates the feature-based architecture in both frontend and backend:

### Frontend (Shop App)

```
features/
  chat/
    components/
      ChatWidget.tsx         # Main container component
      ChatMessage.tsx        # Individual message display
      ChatInput.tsx          # Text input component
      ChatProductList.tsx    # Product list in chat
    hooks/
      useProductChat.ts      # Custom hook for chat state
    services/
      chatService.ts         # API calls to chat endpoints
    types/
      chat.types.ts          # Type definitions
    utils/
      chatFormatters.ts      # Message formatting utilities
    index.ts                 # Public exports
```

### Backend

```
features/
  chat/
    controllers/
      chatController.ts      # Handle HTTP requests
    services/
      queryService.ts        # Extract search queries
      productService.ts      # Search for products
      messageService.ts      # Format messages for AI
    repositories/
      chatRepository.ts      # Database operations
    types/
      chat.types.ts          # Type definitions
    utils/
      categoryMatcher.ts     # Match categories from text
      streamUtils.ts         # Streaming response utilities
    router.ts                # Define routes
```

This organization keeps all chat-related code together while maintaining clear separation from other features.
