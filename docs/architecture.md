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

The backend follows a feature-based architecture pattern, organizing all code by business capabilities rather than technical layers.

### Directory Structure

```
src/
├── features/         # Feature-based code organization
│   ├── auth/         # Authentication feature
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   └── auth.routes.ts
│   ├── products/     # Products feature
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.repository.ts
│   │   └── products.routes.ts
│   ├── chat/         # Chat feature (more complex structure)
│   │   ├── chat.controller.ts
│   │   ├── chat.repository.ts
│   │   ├── chat.routes.ts
│   │   ├── config/
│   │   ├── services/
│   │   └── utils/
│   └── admin/        # Admin-specific features
│       ├── collections/
│       ├── orders/
│       └── products/
├── middleware/       # Shared middleware
├── services/         # Shared services (S3, etc.)
├── types/            # Shared TypeScript types
└── utils/            # Shared utility functions
```

### Feature Module Structure

Each feature is organized as a self-contained module with all related code:

| Component  | Responsibility                                      |
| ---------- | --------------------------------------------------- |
| controller | Handle HTTP requests/responses and error handling   |
| service    | Implement business logic and orchestrate operations |
| repository | Handle database operations and data access          |
| routes     | Define and export the feature's API endpoints       |
| config/    | Feature-specific configuration (when needed)        |
| services/  | Feature-specific services (when needed)             |
| utils/     | Feature-specific utility functions (when needed)    |

### Complex Features

Some features like Chat have additional subdirectories for better organization:

```
features/chatbot/
├── chat.controller.ts
├── chat.repository.ts
├── chat.routes.ts
├── config/
│   ├── ai-config.ts
│   └── query-patterns.ts
├── services/
│   ├── chat-product.service.ts
│   └── conversation.service.ts
└── utils/
    ├── category-matcher.ts
    ├── message-utils.ts
    └── stream-utils.ts
```

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
    chat.controller.ts       # Handle HTTP requests
    chat.repository.ts       # Database operations
    chat.routes.ts           # Define routes
    config/
      ai-config.ts           # AI configuration
      query-patterns.ts      # Query pattern definitions
    services/
      chat-product.service.ts    # Product search service
      conversation.service.ts    # Conversation management
    utils/
      category-matcher.ts    # Match categories from text
      message-utils.ts       # Message formatting utilities
      stream-utils.ts        # Streaming response utilities
```

This organization keeps all chat-related code together while maintaining clear separation from other features.
