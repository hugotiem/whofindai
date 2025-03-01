# Migration Guide: Firebase to Supabase with Prisma

This guide outlines the steps to migrate your application from Firebase to Supabase with Prisma as the ORM.

## Prerequisites

1. Create a Supabase account and project at [https://supabase.com](https://supabase.com)
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Environment Variables

1. Copy the `.env.example` file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `DATABASE_URL`: Your PostgreSQL connection string (from Supabase)

## Database Setup

1. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

2. Create the database schema:
   ```bash
   npm run prisma:migrate
   ```

## Data Migration

1. Run the migration script to transfer data from Firebase to Supabase:

   ```bash
   npm run migrate:firebase-to-supabase
   ```

   This script will:

   - Migrate users from Firebase Authentication to Supabase Auth
   - Migrate profiles and related data from Firestore to PostgreSQL

## Code Changes

The codebase has been updated to use Supabase and Prisma instead of Firebase:

1. Authentication:

   - Firebase Auth → Supabase Auth
   - Updated auth flows for sign-up, sign-in, and session management

2. Database:

   - Firestore → PostgreSQL (via Prisma)
   - Updated data models and queries

3. Configuration:
   - Updated environment variables
   - Added Prisma schema and configuration

## Verification

1. After migration, you can view your database using Prisma Studio:

   ```bash
   npm run prisma:studio
   ```

2. Check the Supabase dashboard to verify user accounts were migrated correctly.

## Troubleshooting

- If you encounter issues with the migration script, check the error logs and run the script again.
- For authentication issues, verify your Supabase configuration and environment variables.
- For database issues, check the Prisma schema and ensure it matches your data structure.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
