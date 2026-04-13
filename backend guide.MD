---- backEnd folder -----

---- install package :
cmd : npm init -y
cmd : npm i express dotenv mongoose cookie-parser bcryptjs cors jsonwebtoken
--- express        : Web framework: HTTP server, routing, middleware chain (`req` → handlers → `res`).
--- dotenv         : Loads variables from `.env` into `process.env` (secrets, `PORT`, `MONGO_URI`, JWT secrets).
--- mongoose       : ODM for MongoDB: schemas, validation, `find` / `create` / `save` on collections.
--- cookie-parser  : Parses the `Cookie` header into `req.cookies` so routes can read cookies (e.g. refresh token).
--- bcryptjs       : Pure-JS password hashing (`hash`) and checks (`compare`); passwords are never stored plain text.
--- cors           : Adds CORS headers so the browser may call this API from another origin (e.g. Vite on port 5173). Use `credentials: true` if you send cookies cross-origin.
--- jsonwebtoken   : Signs and verifies JWTs (`jwt.sign` / `jwt.verify`) using your env secrets.

cmd: npm i nodemon -D
-- nodemon : Restarts the server on file changes during development (`npm run dev`).

---- folder & file roles (what each is in charge of, how it works) :

--- `server.js` (application entry)
    - Creates the Express `app`, loads `dotenv`, calls `connectDB()`.
    - Global middleware: `express.json()` (JSON bodies → `req.body`), `cors(...)`, `cookieParser()`.
    - Mounts routers: `/api/auth` → `routes/auth.js`, `/api/user` → `routes/user.js`.
    - `app.listen(PORT)` starts HTTP; `PORT` comes from `.env` or falls back (e.g. 3000).

--- `config/db.js`
    - Exports `connectDB`: `mongoose.connect(process.env.MONGO_URI)`.
    - On failure logs and `process.exit(1)` so the app does not run without a database.

--- `model/user.js`
    - Defines the **User** schema (username, email, password, role, timestamps).
    - `mongoose.model("User", userSchema)` + `export default User` — this is what controllers import for DB operations.

--- `controller/authController.js`
    - **register**: validates body, checks duplicate email, hashes password, `new User(...).save()`.
    - **login**: finds user by `email`, compares password with `bcrypt.compare`, issues **access JWT** (short-lived, e.g. 15m) and **refresh JWT** (e.g. 7d); refresh token is set as **httpOnly** cookie `refreshToken`.
    - **refreshToken**: reads refresh JWT from cookie, verifies it, loads user, returns a new access token (+ user info).
    - **logout**: clears the `refreshToken` cookie (same options as when it was set).

--- `controller/useController.js`
    - **getUsers**: pagination via `page`, `limit`, `skip`, `countDocuments`, `find().skip().limit()`; omits password with `.select("-password")`.
    - **deleteUser**: `findByIdAndDelete` for admin cleanup.
    - **getProfile**: returns the logged-in user’s profile (driven by token / `req.user` from middleware).

--- `middleware/authMiddleware.js`
    - **verifyToken**: reads `Authorization: Bearer <token>`, verifies access JWT with `ACCESS_TOKEN_SECRET`, attaches payload to `req.user`, then `next()`.
    - **verifyRole("admin")**: factory that returns middleware comparing `req.user.role` to the required role; sends 403 if mismatch.

--- `routes/auth.js`
    - Binds HTTP methods/paths to auth handlers (no business logic here).
    - Typical paths under mount `/api/auth`: `POST /register`, `POST /login`, `GET /refresh`, `POST /logout`.

--- `routes/user.js`
    - Protected routes: chain `verifyToken` (and sometimes `verifyRole("admin")`) before controllers.
    - Under `/api/user` (see your `server.js` mount): e.g. admin list/delete, `GET /me` for current user profile, plus any test routes you add.

--- `.env` (not committed to git)
    - Holds `MONGO_URI`, `PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, etc. `dotenv.config()` in `server.js` loads them before other code runs.

--- `package.json`
    - `"type": "module"` → Node uses **ES modules**; **local imports must include the `.js` extension** (e.g. `from "./routes/auth.js"`).

---- request flow (how a call moves through the app) :
--- Browser/client → `server.js` middleware (JSON, CORS, cookies) → **router** (`routes/*.js`) → optional **middleware** (`verifyToken`, `verifyRole`) → **controller** (read `req`, talk to **User** model / JWT) → `res.json(...)` or `res.cookie(...)`.

---- code process (high level) :
--- Set up `server.js`: listen on `PORT`, connect MongoDB via `MONGO_URI` (`config/db.js`).
--- Define users in `model/user.js` (schema + model export).
--- Auth in `authController.js`: register / login / refresh / logout; JWT for API auth; refresh token in httpOnly cookie.
--- Protect user APIs in `routes/user.js` with `authMiddleware.js` (token + optional admin role).
--- Admin-only features (list users with pagination, delete user) live in `useController.js` and are wired in `routes/user.js`.
