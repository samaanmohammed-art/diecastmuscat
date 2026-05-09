---
description: Create a new sequential Supabase migration file in database/migrations/.
argument-hint: migration-name (e.g. "add_reviews_photos" or "product_360_images")
---

Create a new database migration for Diecast Muscat.

Migration name: $ARGUMENTS

Steps:

1. Check existing migrations to find the next number:
   - Current migrations: 001_create_tables.sql, 002_create_indexes.sql, 003_rls_policies.sql
   - Next number: **004** (increment by 1 for each new migration)

2. Create the file: `database/migrations/004_$ARGUMENTS.sql`

3. Use this template:
   ```sql
   -- Migration: 004_$ARGUMENTS
   -- Created: [today's date]
   -- Description: [one sentence describing what this migration does]

   -- ============================================================
   -- UP
   -- ============================================================

   [SQL for the change — CREATE TABLE, ALTER TABLE, CREATE INDEX, etc.]

   -- Enable RLS on any new tables
   -- ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

   -- Add RLS policies for any new tables
   -- CREATE POLICY "..." ON new_table FOR SELECT USING (...);

   -- ============================================================
   -- DOWN (rollback)
   -- ============================================================

   -- [SQL to reverse the change — DROP TABLE, DROP COLUMN, etc.]
   ```

4. Report:
   - File path created
   - Summary of what the migration does
   - Any application code changes needed to use the new schema (don't make those changes — just flag them)
   - Reminder: test locally with `supabase db reset` before applying to production

**Rules:**
- Never edit existing migration files (001, 002, 003)
- Always include a DOWN section for rollback safety
- Always enable RLS on new tables
- Types for new columns must be added to `src/types/database.ts` separately
