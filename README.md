# NextPro — Full-Stack Blog Platform

A full-featured blogging platform built with Next.js 16, Convex, and Better Auth. Users can sign up, write posts with cover images, browse by category, like, bookmark, comment, and edit their profile — with real-time presence showing who's reading a post.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (base-nova style on `@base-ui/react`) |
| Backend | Convex (realtime database, file storage, functions) |
| Auth | Better Auth + `@convex-dev/better-auth` (email/password) |
| Forms | react-hook-form + Zod |
| Realtime presence | `@convex-dev/presence` |
| Theming | `next-themes` (light/dark/system) |
| Notifications | `sonner` |
| Icons | `lucide-react` |
| Language | TypeScript |

## Features

- **Authentication** — email/password sign-up & login (Better Auth integrated with Convex)
- **Posts CRUD** — create, read, update, delete posts with cover image uploads (Convex storage)
- **Categories** — filter posts (Technology, Lifestyle, Travel, Food, Business)
- **Search** — live search by post title
- **Likes** — toggle likes and view counts
- **Bookmarks** — save posts for later
- **Comments** — threaded discussion on each post
- **Profiles** — public user profile pages + editable display name
- **Dashboard** — manage your own posts (view, edit, delete)
- **Real-time presence** — see who's currently viewing a post (facepile)
- **Dark mode** — system/light/dark theme toggle
- **Route protection** — optimistic redirect of unauthenticated users from `/blog` and `/create`

## Getting Started

### 1. Prerequisites

- Node.js 18+ (or Bun / pnpm)
- A [Convex](https://convex.dev) account (free tier works)

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
bun install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root with:

```env
# Provided by Convex dashboard
CONVEX_DEPLOYMENT=your-convex-deployment-id
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment-site.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=generate-a-random-secret
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

> `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and `NEXT_PUBLIC_CONVEX_SITE_URL` are created automatically when you run `npx convex dev` for the first time. The Better Auth variables must be added manually.

### 4. Run the Convex backend (first time only)

```bash
npx convex dev
```

This provisions the Convex deployment, generates `convex/_generated/`, and links your local environment.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx convex dev` | Start the Convex dev backend (watches `convex/`) |

## Project Structure

```
next.js-16-project-main/
├── app/                            # Next.js App Router
│   ├── (shared-layout)/           # Route group with shared navbar + footer
│   │   ├── layout.tsx             #   Wraps children with the Navbar
│   │   ├── page.tsx               #   Landing page (/) — hero, features, CTA
│   │   ├── blog/
│   │   │   ├── page.tsx           #   Blog grid (/blog)
│   │   │   └── [postId]/
│   │   │       ├── page.tsx       #   Single post (/blog/[postId])
│   │   │       └── loading.tsx   #   Skeleton fallback
│   │   ├── bookmarks/
│   │   │   └── page.tsx          #   Saved posts (/bookmarks)
│   │   ├── create/
│   │   │   ├── page.tsx          #   Create post (/create)
│   │   │   ├── CreateBlogForm.tsx #   Shared create/edit form (RHF + Zod)
│   │   │   └── edit/[postId]/
│   │   │       └── page.tsx       #   Edit post (/create/edit/[postId])
│   │   ├── dashboard/
│   │   │   └── page.tsx          #   User's own posts (/dashboard)
│   │   └── profile/
│   │       ├── [userId]/page.tsx #   Public profile (/profile/[userId])
│   │       └── edit/page.tsx     #   Edit profile (/profile/edit)
│   ├── auth/                     # Auth routes (no shared navbar)
│   │   ├── layout.tsx            #   Centered "Go Back" wrapper
│   │   ├── login/page.tsx        #   Login page (/auth/login)
│   │   └── sign-up/page.tsx      #   Sign-up page (/auth/sign-up)
│   ├── api/                      # Route handlers
│   │   └── auth/[...all]/route.ts#   Better Auth catch-all (strips Expect header)
│   ├── schemas/                  # Zod validation schemas
│   │   ├── auth.ts               #   signUpSchema, loginSchema
│   │   ├── blog.ts              #   postSchema, editPostSchema, deletePostSchema, CATEGORIES
│   │   └── comment.ts          #   commentSchema
│   ├── actions.ts               # Server Actions: create/update/deletePost with image upload
│   ├── layout.tsx               # Root layout: fonts, ThemeProvider, ConvexClientProvider, Toaster
│   ├── globals.css              # Tailwind v4 + shadcn/ui design tokens
│   └── favicon.ico
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (@base-ui/react)
│   │   ├── button.tsx            #   Button + buttonVariants
│   │   ├── card.tsx              #   Card family
│   │   ├── input.tsx             #   Input
│   │   ├── textarea.tsx          #   Textarea
│   │   ├── label.tsx             #   Label
│   │   ├── field.tsx             #   Field/FieldGroup/FieldLabel/FieldError…
│   │   ├── skeleton.tsx          #   Skeleton
│   │   ├── separator.tsx         #   Separator
│   │   ├── avatar.tsx            #   Avatar/AvatarImage/AvatarFallback/AvatarGroup
│   │   ├── dropdown-menu.tsx     #   DropdownMenu suite
│   │   ├── sonner.tsx            #   Toaster (themed, sonner)
│   │   └── theme-provider.tsx    #   next-themes ThemeProvider wrapper
│   └── web/                      # App-specific feature components
│       ├── navbar.tsx            #   Top nav: links, search, auth dropdown, theme toggle
│       ├── ConvexClientProvider.tsx #  ConvexReactClient + ConvexBetterAuthProvider
│       ├── BlogListClient.tsx    #   Blog grid + client-side category filter
│       ├── CategoryFilter.tsx    #   Pill-style category buttons
│       ├── SearchInput.tsx      #   Live search dropdown
│       ├── LikeButton.tsx        #   Like/unlike with count
│       ├── BookmarkButton.tsx    #   Save/unsave toggle
│       ├── CommentSection.tsx    #   Comments list + add-comment form
│       ├── PostPresence.tsx      #   Realtime viewing facepile
│       ├── ProfileEditForm.tsx   #   Edit display name
│       └── theme-toggle.tsx      #   Light/Dark/System switch
│
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated API + dataModel (don't edit)
│   ├── convex.config.ts          # Wires Better Auth + Presence components
│   ├── auth.config.ts            # Convex AuthConfig (Better Auth provider)
│   ├── auth.ts                   # Better Auth setup (email/password, getCurrentUser)
│   ├── http.ts                   # Convex HTTP router (auth routes)
│   ├── schema.ts                 # Tables: posts, comments, likes, bookmarks (+ indexes)
│   ├── posts.ts                  # CRUD, search, categories, image upload
│   ├── likes.ts                  # toggleLike, getLikesByPost, getLikeCounts
│   ├── bookmarks.ts             # toggleBookmark, isBookmarked, getBookmarksByUser
│   ├── comments.ts              # getCommentsByPost, createComment
│   ├── profile.ts               # getUserProfile, getCurrentUserProfile, getCurrentUserId
│   ├── presence.ts              # @convex-dev/presence: heartbeat, list, disconnect
│   └── tsconfig.json
│
├── lib/                          # Shared utilities
│   ├── utils.ts                  # cn() — clsx + tailwind-merge
│   ├── auth-client.ts           # Browser Better Auth client (sign-in/up/out)
│   └── auth-server.ts           # Server Better Auth helpers (getToken, preloadQuery…)
│
├── public/                       # Static assets (default create-next-app SVGs)
│
├── proxy.ts                     # Next.js 16 middleware: optimistic route protection
├── next.config.ts               # serverActions (10mb), remote image hosts
├── eslint.config.mjs            # Flat ESLint config (next core-web-vitals + TS)
├── tsconfig.json                # TS config (strict, @/* alias)
├── components.json              # shadcn/ui config (base-nova)
├── postcss.config.mjs           # Tailwind v4 PostCSS plugin
├── pnpm-workspace.yaml           # pnpm build script config
├── sampleData.jsonl             # Convex seed data (sample)
└── package.json
```

## Routes Overview

| Route | Type | Description |
| --- | --- | --- |
| `/` | Static | Landing page with hero, features, CTA |
| `/blog` | Dynamic | Blog grid with category filter |
| `/blog/[postId]` | Dynamic | Single post with likes, bookmarks, comments, presence |
| `/create` | Dynamic | Create a new post (auth-protected) |
| `/create/edit/[postId]` | Dynamic | Edit a post (author only) |
| `/bookmarks` | Static | Saved posts |
| `/dashboard` | Static | Manage your posts |
| `/profile/[userId]` | Dynamic | Public user profile |
| `/profile/edit` | Dynamic | Edit your display name |
| `/auth/login` | Static | Login |
| `/auth/sign-up` | Static | Sign up |
| `/api/auth/[...all]` | Dynamic | Better Auth API endpoint |

## Database Schema (Convex)

| Table | Key Fields | Indexes |
| --- | --- | --- |
| `posts` | `_id`, title, content, category, authorId, imageStorageId | `search_title`, `search_body`, `by_author`, `by_category` |
| `comments` | `_id`, postId, authorId, authorName, body | `by_post` |
| `likes` | `_id`, postId, userId | `by_post`, `by_user_post` |
| `bookmarks` | `_id`, postId, userId | `by_user`, `by_user_post` |

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new). Remember to:

1. Set all environment variables in the Vercel project settings.
2. Ensure your Convex deployment's auth config (`SITE_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`) points to the production domain.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [shadcn/ui](https://ui.shadcn.com)
