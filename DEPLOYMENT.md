# Deployment Guide for GBV Psychosocial Assessment Tool

This guide outlines the steps to deploy the GBV Psychosocial Assessment Tool to Netlify.

## Prerequisites

1. A Netlify account
2. A PostgreSQL database (NeonDB recommended)
3. Database connection string

## Step 1: Prepare Your Application

The application is already configured for Netlify deployment with:

- `netlify.toml` - Deployment configuration
- `netlify/functions` - Serverless functions
- `.env.production` - Production environment variables

## Step 2: Connect to Netlify

1. Log in to your Netlify account
2. Create a new site from Git
3. Connect to your Git repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

## Step 3: Set Environment Variables

In the Netlify dashboard, go to Site settings > Environment variables and add:

```
DATABASE_URL=your_postgresql_connection_string
```

## Step 4: Deploy

1. Trigger a deploy in the Netlify dashboard
2. Wait for the build to complete
3. Your application will be available at the Netlify-assigned URL

## Step 5: Custom Domain (Optional)

1. In the Netlify dashboard, go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as prompted

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your `DATABASE_URL` environment variable
2. Ensure your database is accessible from Netlify's servers
3. Check database connection logs in Netlify's function logs

### 404 Errors on Page Refresh

If you get 404 errors when refreshing pages:

1. Verify the redirect rules in `netlify.toml`
2. Make sure the publish directory is set to `dist/public`

### API Endpoint Issues

If API endpoints aren't working:

1. Check the Netlify function logs
2. Verify the client is configured to use the correct API URL
3. Ensure CORS settings allow requests from your domain

## Maintenance

### Updating Your Application

1. Push changes to your Git repository
2. Netlify will automatically rebuild and deploy

### Database Migrations

When making database schema changes:

1. Update your local schema
2. Run migrations to update the production database

## Contact Support

For further assistance, contact [your contact information].