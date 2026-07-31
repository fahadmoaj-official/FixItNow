# Render deployment guide

This project is a Node.js + Express API written in TypeScript.

## What `src` is

`src` is the source code folder. It contains the real application code:

- `src/server.ts` starts the server.
- `src/app.ts` creates the Express app and registers routes.
- `src/config/env.ts` reads environment variables.

When you run the build, TypeScript compiles `src` into `dist`. Render should start the compiled output, not the source files.

## What you need before deploy

You need:

- A GitHub repository with this project pushed to GitHub.
- A PostgreSQL database.
- Environment variables set in Render.

## Render setup

Create a new **Web Service** in Render and connect your GitHub repository.

Use these settings:

- **Runtime**: Node
- **Build Command**: `npm install && npx prisma migrate deploy && npm run build`
- **Start Command**: `npm start`

Render will automatically provide the `PORT` variable, so you do not need to set it manually.

## Environment variables

Add these variables in Render:

- `DATABASE_URL` = your PostgreSQL connection string
- `APP_URL` = your frontend URL or allowed client URL for CORS
- `JWT_ACCESS_SECRET` = a strong secret
- `JWT_ACCESS_EXPIRES_IN` = for example `15m`
- `JWT_REFRESH_SECRET` = a strong secret
- `JWT_REFRESH_EXPIRES_IN` = for example `7d`
- `NODE_ENV` = `production`
- `STRIPE_SECRET_KEY` = your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` = your Stripe webhook secret

If you are also deploying the frontend later, replace `APP_URL` with that frontend domain. For now, if you only want to test the API, set it to the URL of the client that will call this API.

## Database note

This project uses Prisma.

The Prisma config points to `prisma/models/schema.prisma`, and migrations are stored in `prisma/migrations`.

The build command includes `npx prisma migrate deploy`, which applies all existing migrations on Render.

## Local start command

For local development:

- `npm run dev` starts `src/server.ts` with watch mode.
- `npm run build` compiles the TypeScript code into `dist`.
- `npm start` runs the compiled server from `dist/src/server.js`.

## Quick checklist

1. Push the code to GitHub.
2. Create a Render PostgreSQL database or use another PostgreSQL provider.
3. Create a Render Web Service.
4. Add all environment variables.
5. Set build and start commands.
6. Deploy.

## After deploy

Test the API root route:

- `GET /` should return `Hello World`

If the service fails to start, check:

- `DATABASE_URL` is valid.
- `PORT` is not hardcoded in Render settings.
- Prisma migrations were applied successfully.
- All required secrets are set.