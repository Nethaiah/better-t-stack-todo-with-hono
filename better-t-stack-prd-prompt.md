# Better T Stack PRD Generation Prompt

## Context
You are an expert technical architect and product manager specializing in modern TypeScript full-stack applications. You will be creating a comprehensive Product Requirements Document (PRD) and technical workflow plan based on the Better T Stack architecture patterns.

## Tech Stack Reference
The Better T Stack is a modern, type-safe full-stack framework with the following core technologies:

### Core Technologies
- **Frontend**: Next.js 14+ with App Router, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui + Radix UI primitives
- **Backend**: Hono (lightweight, performant server framework)
- **API Layer**: oRPC (end-to-end type-safe APIs with OpenAPI integration)
- **Database**: PostgreSQL with Drizzle ORM (TypeScript-first)
- **Authentication**: Better Auth (email/password, OAuth support)
- **State Management**: TanStack Query (React Query) for server state
- **Build System**: Turborepo (monorepo optimization)
- **Package Manager**: npm
- **Code Quality**: Biome (linting, formatting)
- **Development**: Ultracite (enhanced DX tools)

### Architecture Patterns

#### 1. Monorepo Structure
```
project-name/
├── apps/
│   ├── web/         # Next.js frontend application
│   └── server/      # Hono backend API
├── packages/        # Shared packages (if any)
├── turbo.json       # Turborepo configuration
├── package.json     # Root package.json with workspaces
└── biome.json       # Code quality configuration
```

#### 2. Frontend Architecture (Next.js App Router)
- **File-based routing** with app directory
- **Server and Client Components** separation
- **Layout-based composition** with nested layouts
- **Route groups** for organization
- **Loading and Error boundaries** for better UX

#### 3. Backend Architecture (Hono + oRPC)
- **Router-based API structure** with type-safe procedures
- **Zod validation** for input/output schemas
- **Drizzle ORM** for database operations
- **Better Auth integration** for authentication
- **Middleware pattern** for cross-cutting concerns

#### 4. Database Schema Design
- **Drizzle schema definitions** with TypeScript types
- **Migration-based schema changes**
- **Type-safe database operations**
- **Relationship modeling** with foreign keys

#### 5. State Management Pattern
- **TanStack Query** for server state management
- **Optimistic updates** for better UX
- **Error handling** with toast notifications
- **Cache invalidation** strategies

#### 6. Component Architecture
- **shadcn/ui components** as building blocks
- **Composition over inheritance**
- **Props interface** for type safety
- **Custom hooks** for business logic

## PRD Generation Guidelines

### 1. Project Setup and Configuration
- Define the project name and description
- Specify the tech stack variants (frontend, backend, database, etc.)
- Document environment variables and configuration
- Plan the monorepo structure

### 2. Database Schema Design
- Design normalized database schemas
- Define relationships between entities
- Plan indexes for performance
- Consider data validation rules

### 3. API Design (oRPC Procedures)
- Define procedure names and purposes
- Specify input/output schemas with Zod
- Plan error handling strategies
- Document authentication requirements

### 4. Frontend Architecture
- Design page structure and routing
- Plan component hierarchy
- Define state management strategy
- Specify UI/UX patterns

### 5. Authentication and Authorization
- Plan user authentication flow
- Define role-based access control
- Specify protected routes and procedures
- Plan session management

### 6. Development Workflow
- Define development scripts
- Plan testing strategy
- Specify deployment pipeline
- Document code quality standards

## PRD Template Structure

### Executive Summary
- Project overview and objectives
- Key features and benefits
- Success metrics

### Technical Architecture
- System overview diagram
- Technology stack justification
- Scalability considerations

### Database Design
- Entity relationship diagram
- Schema definitions
- Migration strategy

### API Specification
- Procedure definitions
- Request/response schemas
- Authentication requirements
- Error handling

### Frontend Design
- Page structure and routing
- Component architecture
- State management
- UI/UX guidelines

### Authentication System
- User registration/login flow
- Session management
- Authorization rules
- Security considerations

### Development Workflow
- Setup instructions
- Development scripts
- Testing strategy
- Deployment process

### Performance and Security
- Performance optimization
- Security measures
- Monitoring and logging
- Backup and recovery

## Implementation Guidelines

### 1. Follow Better T Stack Conventions
- Use the exact folder structure and naming conventions
- Implement type-safe patterns throughout
- Follow the established component patterns
- Use the recommended state management approach

### 2. Database Best Practices
- Design normalized schemas
- Use appropriate data types
- Plan for scalability
- Implement proper indexing

### 3. API Design Principles
- Keep procedures focused and single-purpose
- Use descriptive naming conventions
- Implement proper validation
- Handle errors gracefully

### 4. Frontend Development
- Use shadcn/ui components consistently
- Implement responsive design
- Follow accessibility guidelines
- Optimize for performance

### 5. Code Quality
- Use TypeScript strictly
- Follow Biome linting rules
- Write meaningful tests
- Document complex logic

## Example Implementation Patterns

### Database Schema Pattern
```typescript
// apps/server/src/db/schema/entity.ts
import { pgTable, text, boolean, serial, timestamp } from "drizzle-orm/pg-core";

export const entity = pgTable("entity", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### oRPC Procedure Pattern
```typescript
// apps/server/src/routers/entity.ts
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { entity } from "../db/schema/entity";
import { publicProcedure } from "../lib/orpc";

export const entityRouter = {
  getAll: publicProcedure.handler(async () => {
    return await db.select().from(entity);
  }),

  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1),
      description: z.string().optional()
    }))
    .handler(async ({ input }) => {
      return await db.insert(entity).values(input);
    }),

  update: publicProcedure
    .input(z.object({ 
      id: z.number(),
      name: z.string().min(1),
      description: z.string().optional()
    }))
    .handler(async ({ input }) => {
      return await db
        .update(entity)
        .set(input)
        .where(eq(entity.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await db.delete(entity).where(eq(entity.id, input.id));
    }),
};
```

### Frontend Component Pattern
```typescript
// apps/web/src/app/entities/page.tsx
"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EntitiesPage() {
  const entities = useQuery(orpc.entity.getAll.queryOptions());
  const createMutation = useMutation(
    orpc.entity.create.mutationOptions({
      onSuccess: () => entities.refetch(),
    }),
  );

  // Component implementation
}
```

## Instructions for AI Assistant

When generating a PRD for a new project using Better T Stack:

1. **Analyze Requirements**: Understand the business requirements and translate them into technical specifications
2. **Design Architecture**: Create a comprehensive technical architecture following Better T Stack patterns
3. **Plan Database**: Design normalized database schemas with proper relationships
4. **Define APIs**: Create oRPC procedures with proper validation and error handling
5. **Plan Frontend**: Design page structure, components, and state management
6. **Consider Security**: Plan authentication, authorization, and security measures
7. **Optimize Performance**: Consider caching, indexing, and optimization strategies
8. **Document Workflow**: Provide clear development and deployment instructions

Remember to maintain consistency with Better T Stack conventions and patterns throughout the entire PRD. The goal is to create a comprehensive plan that can be implemented following the established best practices and architectural patterns of the Better T Stack framework.