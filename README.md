# StudioSpace — Peer-to-Peer Creative Studio Marketplace

StudioSpace is a full-stack marketplace where creators discover and book photography studios, sound stages, podcast rooms, music suites, and art workshops by the hour. Hosts list their spaces, set pricing, and review booking requests; creators can track every request from pending approval to a confirmed session.

- **Live site:** https://studiospace-client-g428.vercel.app
- **Live API:** https://studiospace-server-7gad.onrender.com
- **Client repository:** https://github.com/Selim-Ahmed93/studiospace-client
- **Server repository:** https://github.com/Selim-Ahmed93/studiospace-server

> The API is hosted on Render's free tier and may take a few seconds to wake up after a period of inactivity.

## Examiner accounts

These accounts are seeded for review. Both use the same password.

| Role | Email | Password |
|---|---|---|
| Host (owns demo listings) | `host.examiner@studiospace.dev` | `StudioSpace2026!` |
| Creator (booking history) | `creator.examiner@studiospace.dev` | `StudioSpace2026!` |

If the demo database is reset, create a new account from `/register` and list a studio from `/add-studio`.

## Features

- **Email/password authentication** with Better Auth, HTTP-only session cookies, protected routes, and redirect-back support after login.
- **Optional Google sign-in** when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured on the server.
- **Studio discovery** with keyword search, category, city, minimum/maximum hourly rate, active filter chips, mobile filter sheet, and pagination.
- **Studio detail pages** with an image gallery, amenities, host information, honest “no reviews yet” empty state, and server-calculated booking totals.
- **Host studio management** with create, edit, and delete flows, owner-only authorization, image URL previews, and an amenity picker.
- **Booking requests** with date/time validation, minimum one-hour duration, pending/confirmed statuses, and double-booking conflict handling.
- **Creator dashboard and My Bookings** with pending-request counts, status filters, and cancellation of pending requests.
- **Responsive, accessible UI** built with Tailwind CSS v4 and Base UI primitives, including a mobile navigation sheet and dark mode.
- **Custom 404, loading, and error states**, plus toast notifications instead of browser alerts.
- **Newsletter form** that validates email addresses and stores the subscription locally in the browser (there is no newsletter backend).

## Tech stack

### Client

- Next.js 16 (App Router) and React 19
- Tailwind CSS v4 with shadcn/Base UI components
- Better Auth React client
- Axios
- React Hook Form + Zod
- Swiper
- Sonner, Lucide React, next-themes

### Server

- Node.js + Express 5
- MongoDB Atlas + Mongoose
- Better Auth with the MongoDB adapter
- Zod request validation
- Helmet and configurable CORS
- Render deployment

## Local setup

### 1. Prerequisites

- Node.js 20 or newer
- npm
- Access to the deployed API, or a local copy of the server

### 2. Install dependencies

```bash
git clone https://github.com/Selim-Ahmed93/studiospace-client.git
cd studiospace-client
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
# Leave empty so the browser calls /api/* on the frontend origin.
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Server-only target for the /api/* rewrite (local Express API).
API_PROXY_TARGET=http://localhost:5000
```

The browser never talks to the Render API directly. Next.js rewrites
`/api/:path*` to `API_PROXY_TARGET`, so authentication requests and cookies stay
on the frontend origin. This is required for OAuth: browsers that block
third-party cookies would otherwise drop Better Auth's state cookie during the
Google redirect.

If you point `NEXT_PUBLIC_API_URL` at an absolute API URL instead, the browser
goes back to cross-site requests and Google login can fail with
`state_mismatch` in browsers with third-party cookie blocking enabled.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Public API base URL. Leave empty for the same-origin proxy. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for metadata; defaults to `http://localhost:3000` |
| `API_PROXY_TARGET` | Yes in production | Server-only destination of the `/api/*` rewrite (the Render API URL) |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Run the production build
npm run lint   # Run ESLint
```

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page with hero search, categories, featured studios, and host CTA |
| `/studios` | Public | Explore studios with filters and pagination |
| `/studios/[id]` | Public | Studio details and booking form |
| `/login` | Public | Email/password and Google login |
| `/register` | Public | Account creation |
| `/dashboard` | Private | Listings, pending requests, and recent bookings |
| `/add-studio` | Private | Create a studio listing |
| `/my-listings` | Private | Manage owned listings |
| `/studios/edit/[id]` | Private | Edit an owned listing |
| `/my-bookings` | Private | Track and cancel booking requests |
| `/terms`, `/privacy` | Public | Legal and privacy information |

## API integration

The browser calls the same-origin `/api/*` routes on the Next.js app. Next.js
proxies those requests to the Express API configured by `API_PROXY_TARGET`.
Keeping the browser on one origin makes the session and OAuth state cookies
first-party. Key endpoints:

- `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, `GET /api/auth/get-session`
- `GET /api/config` (returns public capability flags such as whether Google is enabled)
- `GET /api/studios`, `GET /api/studios/:id`
- `POST /api/studios`, `PATCH /api/studios/:id`, `DELETE /api/studios/:id`
- `POST /api/bookings`, `GET /api/bookings/my-bookings`, `PATCH /api/bookings/:id/cancel`

Studio and booking write routes require an authenticated session. The API returns JSON errors with meaningful messages, which the UI surfaces through inline errors and toasts.

## Authentication notes

- Sessions are stored in HTTP-only cookies. Because the browser uses the same-origin `/api/*` proxy, both session and OAuth state cookies are first-party and survive browsers that block third-party cookies. The API still uses `SameSite=None; Secure` in HTTPS production for compatibility with direct callers.
- The Google OAuth redirect URI is built from the server's `BETTER_AUTH_URL`, which must be the public **frontend** origin when using the proxy (for example `https://studiospace-client-g428.vercel.app`). The callback is then proxied back to Render.
- The client reads `GET /api/config` and only renders the Google button when the API reports `googleAuthEnabled: true`. If Google is not configured, the button is hidden instead of producing a `PROVIDER_NOT_FOUND` error.
- After login or sign-up, users are sent to the `redirect` page they came from, or to the homepage. A visible **Back to home** link is always available on both auth screens.
- Protected pages redirect unauthenticated visitors to `/login?redirect=...` and return them to the original page after login.

## Deployment

### Vercel

1. Import the `studiospace-client` repository into Vercel.
2. Set `NEXT_PUBLIC_API_URL` to an empty value (do not point it at Render).
3. Set `NEXT_PUBLIC_SITE_URL` to the production Vercel URL.
4. Set `API_PROXY_TARGET` to the Render API URL, e.g.
   `https://studiospace-server-7gad.onrender.com`. This is read by
   `next.config.mjs` at build time, so set it for every Vercel environment you
   build and redeploy after changing it.
5. Deploy and update the **Live site** link above if Vercel assigns a different domain.

The build fails deliberately if `API_PROXY_TARGET` is missing in production,
instead of deploying an app whose `/api/*` routes would 404.

### Render API

Set the following environment variables on the API service:

- `BETTER_AUTH_URL` — the production **Vercel** origin, e.g.
  `https://studiospace-client-g428.vercel.app`. This makes Better Auth generate
  `https://studiospace-client-g428.vercel.app/api/auth/callback/google` as the
  Google redirect URI.
- `CLIENT_URL` — the production Vercel origin
- `ADDITIONAL_CLIENT_URLS` — comma-separated preview or localhost origins
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, for Google login

Also add `https://studiospace-client-g428.vercel.app/api/auth/callback/google`
to the Google Cloud OAuth client's **Authorized redirect URIs**.

After changing either deployment, sign in once and verify that
`/api/auth/get-session` returns the session from the browser.

## Known limitations

- Payments are not processed. Booking totals are recorded, and hosts/creators arrange payment directly.
- Overlapping pending requests are allowed; only confirmed bookings block a new request for the same time slot.
- Reviews are not collected yet. Listings show an honest empty state until a reviews API exists.
- Photos are added by URL rather than file upload.
- The newsletter form stores emails in browser local storage only.
- Google login requires server-side OAuth credentials.

## Contact

- Email: mdselimahmed6467@gmail.com
- Location: Dhaka, Bangladesh
