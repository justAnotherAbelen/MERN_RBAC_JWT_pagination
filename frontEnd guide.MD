# Frontend Guide

## Tech Stack
- React + Vite
- React Router (`react-router-dom`)
- Axios (API calls)
- Tailwind CSS (utility classes)

## Setup
1. Create Vite app:
   - `npm create vite@latest .`
2. Install dependencies:
   - `npm install`
   - `npm install react-router-dom axios`
   - `npm install tailwindcss @tailwindcss/vite`
3. Start dev server:
   - `npm run dev`

## Folder Overview (`frontEnd/src`)
- `main.jsx`  
  Entry point. Renders `<App />`.
- `App.jsx`  
  Main app composition: router, auth provider, navbar, route config.
- `context/authContext.jsx`  
  Stores auth state (`auth`, `setAuth`, `loading`) and exposes `useAuth()`.
- `components/NavBar.jsx`  
  Shows navigation links and logout button based on auth state.
- `components/privateRoute.jsx`  
  Protects private pages (requires access token, optional role check).
- `components/PublicRoute.jsx`  
  Protects public-only pages (redirects logged-in users away from login/register).
- `pages/login.jsx`  
  Login form; authenticates user and stores access token + role in auth context.
- `pages/register.jsx`  
  Registration form; on success redirects to login.
- `pages/UserDashboard.jsx`  
  Fetches and displays current user profile (`/api/user/me`).
- `pages/AdminDashboard.jsx`  
  Fetches paginated users (`/api/user/all`) and supports delete (`/api/user/:id`).

## App Composition and Nesting
`App.jsx` uses nested wrappers:
- `BrowserRouter` (parent): provides routing context.
- `AuthProvider` (parent): provides auth context to all nested components.
- `NavBar` + `Routes` (children): consume router/auth context.

Why nesting is used:
- Shared context is defined once at the top.
- Route guards and pages can access auth and navigation without prop drilling.

## Route Configuration
- `/login` -> wrapped by `PublicRoute` -> renders `Login`
- `/register` -> wrapped by `PublicRoute` -> renders `Register`
- `/` -> wrapped by `PrivateRoute` -> role-based render:
  - admin -> `AdminDashboard`
  - non-admin -> `UserDashboard`

## Authentication Flow
1. App starts -> `AuthProvider` runs `checkAuth()`.
2. `checkAuth()` calls `GET /api/auth/refresh` with `withCredentials: true`.
3. If refresh succeeds:
   - `auth` is set with `accessToken` and `role`.
4. If refresh fails:
   - `auth` is set to `null`.
5. `loading` becomes `false` and route guards decide what to render.

## Route Guard Behavior

### `PrivateRoute`
- If `loading` -> shows loading UI.
- If no `auth` or no token -> redirects to `/login`.
- If `allowedRoles` provided and role not allowed -> redirects to `/login`.
- Else renders protected content.
- Supports two child patterns:
  - JSX child: `<PrivateRoute><Dashboard/></PrivateRoute>`
  - Function child: `<PrivateRoute>{(auth) => ...}</PrivateRoute>`

### `PublicRoute`
- If `loading` -> shows loading UI.
- If authenticated -> redirects to `/`.
- Else renders public page (`children`).

## API Endpoints Used by Frontend
- `POST /api/auth/register` (register page)
- `POST /api/auth/login` (login page)
- `POST /api/auth/logout` (navbar logout)
- `GET /api/auth/refresh` (auth context bootstrapping)
- `GET /api/user/me` (user dashboard)
- `GET /api/user/all` (admin dashboard list)
- `DELETE /api/user/:id` (admin dashboard delete)

## Important Axios Notes
- `withCredentials: true` is used where cookie-based refresh/logout interaction is needed.
- Access token is sent in `Authorization: Bearer <token>` for protected endpoints.

## Styling
- Tailwind is enabled in `index.css` with:
  - `@import "tailwindcss"`
- Components use utility classes for spacing, colors, and layout.

## Current Behavior Summary
- Guests can access login/register.
- Authenticated users are redirected away from login/register.
- Root route is protected and role-aware.
- User dashboard fetches profile.
- Admin dashboard fetches user list and shows delete actions.