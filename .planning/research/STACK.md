# Technology Stack

**Project:** Todo App
**Researched:** 2025-04-29
**Confidence:** HIGH

## Recommended Stack

### Core Framework (Frontend)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.x | UI library | Standard frontend choice, React 19 has improved concurrent features and compiler support |
| Vite | 7.x | Build tool | 43M+ weekly downloads, fast HMR using native ES modules, 31MB vs CRA's 140MB |
| TypeScript | 5.7+ | Type safety | Catches errors at compile time, improves maintainability |

### Core Framework (Backend)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20 LTS+ | Runtime | Long-term support, Vite requires Node 20.19+ |
| Express | 5.x | HTTP framework | Minimal, flexible, mature ecosystem (most popular Node.js framework) |

### Database

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| SQLite | 4.x | Embedded database | Zero-config, single file, ACID compliant, no server required |
| better-sqlite3 | 11.x | Node driver | Synchronous API, faster than async drivers for simple apps |

### State Management

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.x | Global state | Simple to medium apps - no boilerplate, React hooks-based |
| React Context + useReducer | Built-in | Built-in state | Very simple apps, no external dependencies |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | 5.x | Server state | When fetching from API, handles caching/loading/error states |
| zod | 3.x | Validation | TypeScript-first schema validation |
| cors | 2.x | CORS middleware | When frontend/backend on different ports |
| helmet | 8.x | Security headers | Production security |
| express-rate-limit | 7.x | Rate limiting | Production API protection |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Use flat config, extends react-app |
| Prettier | Formatting | Single quotes, semicolons: no |
| tsx | TypeScript runner | Faster than ts-node for dev scripts |
| nodemon | Auto-restart | Watch mode for backend |

## Installation

```bash
# Frontend
npm create vite@latest client -- --template react-ts
cd client
npm install zustand zod @tanstack/react-query
npm install -D @types/node

# Backend
mkdir server && cd server
npm init -y
npm install express cors helmet better-sqlite3 zod
npm install -D typescript @types/node @types/express @types/cors tsx nodemon
```

## Alternatives Considered

| Category | Recommended | Alternative | When to Use Alternative |
|----------|-------------|-------------|----------------------|
| State Management | Zustand | Redux Toolkit | Enterprise apps needing strict structure, time-travel debugging |
| State Management | Zustand | Jotai | When fine-grained atomic updates needed |
| Database | SQLite | PostgreSQL | Apps requiring horizontal scaling, complex joins |
| Database | SQLite | MongoDB | Prototype with highly variable schema |
| Build Tool | Vite | Next.js | When SSR, SEO, or routing framework needed |
| Backend | Express | Fastify | When performance critical, need for schema-based validation |
| Backend | Express | NestJS | Enterprise apps wanting OOP structure |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|------------|
| Create React App | Heavy (140MB deps), slow HMR, deprecated | Vite |
| class components | Functional components are standard in React 19 | Function components + hooks |
| Redux (vanilla) | Excessive boilerplate | Zustand or Redux Toolkit |
| MongoDB for simple apps | Overkill for todo app, operational complexity | SQLite |
| pg (for simple todo app) | Requires PostgreSQL server | better-sqlite3 |
| BodyParser built-ins | Deprecated, Express 5 has built-in | Express 5 native |

## Stack Patterns by Variant

**If user authentication required:**
- Add bcryptjs for password hashing
- Add jsonwebtoken for JWT tokens
- Use PostgreSQL instead of SQLite

**If real-time updates needed:**
- Add Socket.io
- Or use server-sent events

**If multi-user with sharing:**
- Migrate to PostgreSQL
- Add Prisma ORM for complex queries

## Version Compatibility

| Package | Compatible With | Notes |
|---------|----------------|-------|
| Vite 7.x | Node 20.19+, React 19.x | Current stable |
| React 19.x | Vite 5+, TypeScript 5.7+ | React Compiler support in Vite 5+ |
| Express 5.x | Node 18+, cors 2.x+ | New default in 2025 |
| Zustand 5.x | React 16.8+, TypeScript 5.0+ | Works with React Server Components |
| better-sqlite3 11.x | Node 18+, SQLite 3.x+ | Native module, rebuilds on install |

## Sources

- Vite releases — `https://vite.dev/releases` — Current stable versions
- npm @vite/plugin-react — `https://www.npmjs.com/package/@vitejs/plugin-react` — React plugin versions (6.0.1)
- Node.js Express best practices — `https://github.com/goldbergyoni/nodebestpaystics` — Backend patterns
- React state management 2025 — `https://toxigon.com/react-state-management-in-2025` — Zustand recommendations
- Database comparison 2025 — `https://theartofcto.com/comparisons/postgres-v-mongodb/` — SQLite as default for simple apps

---

*Stack research for: Todo App*
*Researched: 2025-04-29*