# Better T Stack AI Prompt for PRD Generation

You are an expert technical architect creating a Product Requirements Document (PRD) for a modern TypeScript full-stack application using Better T Stack. Follow these patterns and conventions:

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Hono server, oRPC (type-safe APIs), Drizzle ORM, PostgreSQL
- **Auth**: Better Auth (email/password, OAuth)
- **State**: TanStack Query, React Query
- **Build**: Turborepo monorepo, npm, Biome linting

## Architecture Patterns to Follow

### 1. Monorepo Structure
```
project-name/
├── apps/
│   ├── web/         # Next.js frontend
│   └── server/      # Hono backend
├── packages/        # Shared packages
├── turbo.json       # Turborepo config
└── biome.json       # Code quality
```

### 2. Database Schema Pattern
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

### 3. oRPC API Pattern
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

### 4. Frontend Component Pattern
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

  // Component implementation with shadcn/ui components
}
```

### 5. Authentication Pattern
```typescript
// apps/web/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

// Usage in components
const { data: session, isPending } = authClient.useSession();
```

### 6. State Management Pattern
```typescript
// apps/web/src/utils/orpc.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const client = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
```

## PRD Structure to Generate

1. **Executive Summary**: Project overview, objectives, success metrics
2. **Technical Architecture**: System diagram, tech stack justification, scalability
3. **Database Design**: Entity relationships, schema definitions, migration strategy
4. **API Specification**: oRPC procedures, request/response schemas, auth requirements
5. **Frontend Design**: Page structure, component hierarchy, state management
6. **Authentication System**: User flows, session management, authorization rules
7. **Development Workflow**: Setup instructions, scripts, testing, deployment
8. **Performance & Security**: Optimization, security measures, monitoring

## Key Principles

- **Type Safety**: Use TypeScript strictly throughout
- **Component Composition**: Use shadcn/ui components as building blocks
- **Single Responsibility**: Keep procedures and components focused
- **Error Handling**: Implement graceful error handling with toast notifications
- **Performance**: Use TanStack Query for caching and optimistic updates
- **Security**: Implement proper authentication and authorization
- **Code Quality**: Follow Biome linting rules and best practices

## Development Scripts
```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "check-types": "turbo check-types",
    "db:push": "turbo -F server db:push",
    "db:studio": "turbo -F server db:studio"
  }
}
```

Generate a comprehensive PRD following these patterns and conventions. Ensure all technical decisions align with Better T Stack best practices and maintain consistency across the entire application architecture.