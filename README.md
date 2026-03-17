# Biko — Social platform for service providers and seekers

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/status-in_development-yellow?style=for-the-badge)


![Preview do site](https://media.byissa.dev/biko/preview.png)
<p align="center">
  <a href="#about">About</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#structure">Structure</a> •
  <a href="#tests">Tests</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#related-projects">Related Projects</a>
</p>

**Biko** is a platform that connects clients to informal service providers, working like a social network where users can register, share their work, and interact through posts, likes and comments.

This codebase handles the **Frontend** experience, developed in **Next.js 14 App Router** + **TypeScript** + **Tailwind CSS** to create a clean and engaging interface.

🔗 The backend API developed with Laravel is available [here](https://github.com/issagomesdev/biko-api).

<h2 id="about"> 📌 About</h2>

This project was developed as the final assignment for the Laboratory of Innovative Enterprises course in the Analysis and Systems Development (ADS) program at UNINASSAU. It aims to provide a practical solution connecting informal service providers with potential clients through a social platform, demonstrating the application of software development skills and innovative business concepts learned throughout the course.

💻 You can try the live version at [biko.byissa.dev](https://biko.byissa.dev/)

<h2 id="roadmap"> 🚧 Roadmap</h2>

### ✅ Implemented

- Landing page (home) with sections: Hero, Stats, Features, How It Works, CTA, Footer
- Multi-step user registration: credentials → location (state/city) → services (providers only)
- Authentication with HttpOnly cookies (secure token storage via Next.js Route Handlers)
- Login with redirect to feed and toast error feedback
- Register with role selection (client or provider), Zod validation, and cross-step state via Zustand
- Location selection with lazy-loaded cities (hidden until state is selected)
- 3-day localStorage cache for states, cities, and categories (avoids redundant API calls)
- API error handling: field-level messages extracted from Laravel's `errors` object shown as toasts
- Email conflict detection: redirects back to register form with the error displayed under the email field
- Timeline feed with real API data, infinite scroll (IntersectionObserver), and optimistic like updates
- Filter sidebar: post type (client/provider), categories, state/city cascade, date presets, and sort order
- Mobile filter drawer with draft state (filters only applied on "Aplicar")
- Search bar connected to feed filters with 400ms debounce
- `is_liked` correctly resolved for authenticated users via Next.js proxy route (Bearer token injected from HttpOnly cookie)
- PostCard displays author name, `@username`, type badge (Prestador/Cliente), primary category, city/state (author row), relative date below options icon, post text with inline tags and highlighted mentions, publication categories and location
- Post options menu (PostMenuPopup) with conditional items: edit/delete (author only), follow/unfollow (non-blocked non-author only), block/unblock (non-author only), copy link, view publication
- Publication create/edit form (`PublicationFormShell`) with toast-based validation — shows missing required fields on submit instead of disabling the button
- Existing media thumbnails rendered inline with new uploads in the same row (`MediaGrid`)
- City/state selection is optional when creating or editing publications
- Comment sorting in publication detail: most recent, oldest, or popular (by likes + replies)
- Author categories and city/state included in publication list and detail API responses
- Edit publication cache update — feed and detail stay in sync after saving without requiring a page refresh

### 🔄 Planned
- Logged-in user profile editing, including activity categories
- Public user profiles with posts and basic interaction history
- Service reviews from both clients and providers
- Real-time notifications
- Private messaging/chat system
- Post saving/bookmarking
- Report system for inappropriate content

<h2 id="technologies"> 🧪 Technologies</h2>

- [Next.js 14](https://nextjs.org/) 
- [TypeScript](https://www.typescriptlang.org/) 
- [Tailwind CSS v3](https://tailwindcss.com/) 
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) 
- [TanStack Query v5](https://tanstack.com/query) 
- [Zustand v5](https://zustand-demo.pmnd.rs/) 
- [Sonner](https://sonner.emilkowal.ski/) 
- [Docker](https://www.docker.com/) 
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) 

<h2 id="structure"> 📁 Structure</h2>

```
src/
├── app/                # Next.js App Router — pages, layouts, Route Handlers
│   ├── (auth)/         # Auth routes group (login, register flow)
│   ├── (protected)/    # Protected routes (feed) — guarded by middleware
│   └── api/            # Route Handlers — proxy to Laravel with HttpOnly cookie support
├── components/         # React components
│   ├── auth/           # Auth forms, layouts, role selector
│   ├── feed/           # Feed-specific components (FeedHeader, FilterSidebar, FilterDrawer, CreatePost)
│   ├── home/           # Landing page sections (Hero, Features, CTA, Footer…)
│   ├── layout/         # Shared layout components (BottomNav, UserPopup)
│   ├── post/           # Reusable post components (PostCard, PostMenuPopup, PostText)
│   ├── publication/    # Publication form shell and sub-components (MediaGrid, CategorySelectPopup)
│   ├── ui/             # Reusable primitives (Button, Input, Select, ConfirmModal, PageLoader…)
│   └── providers/      # Context providers (QueryProvider)
├── hooks/              # Data fetching and form hooks (useStates, useCities, useCategories, usePublicationForm)
├── middleware.ts        # Route protection — redirects unauthenticated users to /login
├── services/           # API layer (api.ts, auth, location, category)
├── stores/             # Zustand stores (user session, register multi-step draft)
├── lib/                # Utilities and Zod schemas (cache, validations)
├── types/              # TypeScript interfaces (ApiResponse, User, Category…)
├── __tests__/          # Test suites (Vitest)
└── constants/          # Static fallback data (locations, categories)
```

<h2 id="tests"> 🧪 Tests</h2>

The project uses **Vitest** + **Testing Library** with `jsdom` environment. All external dependencies (API calls, stores, navigation) are mocked — **no running server or Docker required**.

### Running tests

```bash
# Locally (recommended — faster, no Docker needed)
npm test                   # run all tests once
npm run test:watch         # watch mode

# Inside Docker container
docker compose exec app npm test
docker compose exec app npm run test:watch
```

### Coverage

| Suite | File | Tests |
|---|---|---|
| Validations | `auth-schema.test.ts` | loginSchema, registerSchema (email, password, role, confirmPassword) |
| Validations | `register-schema.test.ts` | locationSchema, servicesSchema |
| Services | `auth-service.test.ts` | login, register, logout — success, errors, field errors |
| Services | `publication-service.test.ts` | list — query params, filters, pagination |
| Services | `api.test.ts` | get, post — JSON, errors, non-JSON responses |
| Lib | `cache.test.ts` | withCache — hit, miss, expiration, corrupted storage |
| Hooks | `use-states.test.ts` | success, error, staleTime |
| Hooks | `use-cities.test.ts` | disabled when stateId=null, enabled when provided |
| Hooks | `use-categories.test.ts` | success, error, single fetch |
| Hooks | `usePublicationForm.test.ts` | canSubmit, buildFormData (text trim, city_id optional, categories, tags, mentions), handleStateChange, initial values |
| Components | `Button.test.tsx` | variants, loading spinner, disabled, onClick |
| Components | `Input.test.tsx` | label, error message, ref forwarding, native props |
| Components | `LoginForm.test.tsx` | render, validation, submit, toasts, sessionStorage flash |
| Components | `PostText.test.tsx` | plain text, mention highlight, case-insensitive match, dotted username, tags, no tags |
| Components | `PostCard.test.tsx` | author info (name, username, badge, category, location), post body (text, categories, location, mentions), like toggle, comment button navigation, options menu |
| Components | `PostMenuPopup.test.tsx` | author items (edit/delete), non-author items (follow/unfollow, block/unblock), copy link, hide follow when blocked, hideView prop, ConfirmModal delete flow |
| Components | `FilterDrawer.test.tsx` | open/closed state, type buttons, categories, state/city selects, orderBy, date, apply/clear actions |
| Utils | `commentSort.test.ts` | recent (newest first), oldest (oldest first), popular (likes+replies score), no array mutation, empty/single, undefined replies |

<h2 id="getting-started">▶️ Getting Started</h2>

### Requirements

- [Docker](https://www.docker.com/) and Docker Compose
- Backend API running (Laravel)

### Environment variables

Copy and configure environment variables `cp .env.example .env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api 
...
```

### Running with Docker

The project uses `docker-compose.override.yml` to separate dev and production concerns:

- **`docker-compose.yml`** — production config (code baked into the image)
- **`docker-compose.override.yml`** — dev overrides (source volume + hot reload), applied automatically

```bash
# Clone the repository
git clone https://github.com/issagomesdev/biko.git
cd biko

# Dev — hot reload via volume mount (override applied automatically)
docker compose up --build   # first run or after adding new packages
docker compose up           # subsequent runs

# Production — code baked into image, no volumes
docker compose -f docker-compose.yml up --build
```

### Running locally (without Docker)

```bash
npm install
npm run dev
```

> After adding new npm packages in a Docker environment, run `docker compose down -v && docker compose up --build` to rebuild the container with updated dependencies.

<h2 id="related-projects">🔗 Related Projects</h2>

🧱 Backend (Laravel API) repository [here](https://github.com/issagomesdev/biko-api)
