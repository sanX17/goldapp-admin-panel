# GoldApp Admin

## Local Development

1. Create a local env file from the template:

```bash
cp .env.example .env.local
```

2. Fill in the Firebase values in `.env.local`.

3. Start the app:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

This project uses the following Firebase environment variables:

```env
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_APP_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

ADMIN_SESSION_SECRET=
```

`FIREBASE_ADMIN_PRIVATE_KEY` should be stored with escaped newlines in `.env.local`, for example:

```env
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

`.env.local` is intentionally ignored and should not be committed.

## Production Deployment

For production on Vercel:

1. Open your Vercel project.
2. Go to `Settings -> Environment Variables`.
3. Add all values from `.env.example` using the real Firebase values.
4. Redeploy the project after saving the variables.

## Important Note

The `NEXT_PUBLIC_*` values are exposed to the browser by design in Next.js. Admin authentication now relies on a server-side Firebase Admin check plus an `httpOnly` session cookie signed with `ADMIN_SESSION_SECRET`.
