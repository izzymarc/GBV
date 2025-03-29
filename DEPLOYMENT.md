# Deploying to Netlify

This document provides instructions for deploying the GBV Psychosocial Assessment Tool to Netlify.

## Prerequisites

1. A Netlify account
2. Access to a PostgreSQL database (such as NeonDB)

## Deployment Steps

### 1. Connect to Netlify

1. Sign in to your Netlify account
2. Click "Add new site" and select "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, etc.) and select the repository
4. Select the branch to deploy (usually `main` or `master`)

### 2. Configure Build Settings

The build settings should be automatically detected from the `netlify.toml` file, but verify:

- Build command: `npm run build`
- Publish directory: `dist`

### 3. Configure Environment Variables

Set the following environment variables in Netlify's dashboard (Site settings > Environment variables):

- `DATABASE_URL`: Your PostgreSQL connection string
- Any other sensitive information needed for the application

### 4. Deploy

1. Click "Deploy site"
2. Wait for the build and deployment to complete
3. Your site will be available at the URL provided by Netlify

### 5. Setup Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

## Serverless Functions

This application uses Netlify Functions to handle backend API requests. The functions are located in the `netlify/functions` directory.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the deployment logs in Netlify's dashboard
2. Verify that all environment variables are correctly set
3. Ensure your database is accessible from Netlify's servers
4. Check the function logs for any errors in API requests

## Database Migrations

Before deploying, make sure your database schema is up to date by running migrations. On your local machine, run:

```
npm run db:push
```

This will apply any pending database migrations to your production database.