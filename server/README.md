# Hondaunit Backend Server

Node.js + Express API using MongoDB for persistence. Handles public experience (user listing, profiles, contact form) and admin operations (user mgmt, events, gallery, inbox).

## Directory structure

```
server/
├── config/          # Database + runtime configuration
├── controllers/     # Request handlers (business logic)
├── middleware/      # Auth, error handling, etc.
├── models/          # Mongoose schemas
├── routes/          # Express routers grouped by feature
├── services/        # Cross-cutting helpers (token, mail, storage)
├── utils/           # Shared utilities (asyncHandler, HttpError)
└── server.js        # App bootstrap
```

## Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port (defaults to `5000`) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URLS` | Comma-separated list of allowed origins for CORS |
| `RESEND_API_KEY` | (Optional) email delivery key |
| `RESEND_FROM_EMAIL` | From email used when emailing visitor/admin |
| `RESEND_TO_EMAIL` | Admin notifications recipient |

## Core data models

### User
- `name`, `email`, `passwordHash`
- `role`: `user` or `admin`
- `title`, `bio`, `location`, `avatarUrl`
- `socialLinks`: array of `{ platform, url, handle }`
- `publicSlug`: unique string for public profiles
- `isActive`, `lastLogin`, timestamps

### Event
- `title`, `description`, `location`
- `startDate`, `endDate`
- `coverImage`, `isPublished`
- `createdBy` (User reference)

### GalleryItem
- `title`, `description`, `imageUrl`, `category`
- `isFeatured`, `createdBy`

### ContactMessage
- `name`, `email`, `handle`, `message`
- `status`: `new`, `in_progress`, `resolved`
- `adminNotes`, `respondedAt`

## API surface (summary)

### Auth
- `POST /api/auth/register` — bootstrap account (optional to disable in prod)
- `POST /api/auth/login` — email + password, sets httpOnly cookie
- `POST /api/auth/logout`
- `GET /api/auth/me` — current session

### Public
- `GET /api/users` — paginated active users (landing table)
- `GET /api/users/:slug` — public profile detail
- `POST /api/contact` — visitor contact form (stores + emails)
- `GET /api/events/public` — published events
- `GET /api/gallery` — public gallery feed

### Authenticated user dashboard
- `PUT /api/users/me` — update profile, socials, description
- `PUT /api/users/me/password` — change password

### Admin
- `GET /api/admin/overview` — dashboard stats (users/events/gallery/messages)
- `GET|POST|PUT|DELETE /api/admin/users`
- `GET|POST|PUT|DELETE /api/admin/events`
- `GET|POST|PUT|DELETE /api/admin/gallery`
- `GET|PUT /api/admin/contact` — manage visitor messages

Detailed controller contracts live near each handler.

## Local development

```bash
npm install
npm run server # starts API on :5000
```

Use a tool like `concurrently` if you want to run the Vite client + server together.
