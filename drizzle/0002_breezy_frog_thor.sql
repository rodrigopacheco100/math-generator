-- Migration: Convert answers to JSONB format
-- This migration adds problem, userAnswer, correctAnswer as JSONB columns
-- and migrates data from the old integer columns

-- Step 1: Add new JSONB columns
ALTER TABLE "answers" ADD COLUMN IF NOT EXISTS "problem" jsonb;
ALTER TABLE "answers" ADD COLUMN IF NOT EXISTS "new_user_answer" jsonb;
ALTER TABLE "answers" ADD COLUMN IF NOT EXISTS "new_correct_answer" jsonb;

-- Step 2: Migrate data to new columns
UPDATE "answers" SET 
  "problem" = jsonb_build_object(
    'type', "operation",
    'operands', jsonb_build_array("operand1", "operand2")
  ),
  "new_user_answer" = to_jsonb("user_answer"),
  "new_correct_answer" = to_jsonb("correct_answer")
WHERE "problem" IS NULL;

-- Step 3: Ensure columns are JSONB type
ALTER TABLE "answers" ALTER COLUMN "new_user_answer" SET DATA TYPE jsonb;
ALTER TABLE "answers" ALTER COLUMN "new_correct_answer" SET DATA TYPE jsonb;

-- Step 4: Convert is_correct to boolean
ALTER TABLE "answers" ALTER COLUMN "is_correct" TYPE bool USING (CASE WHEN "is_correct" = 1 THEN true ELSE false END);

-- Step 5: Drop old columns (if they exist)
ALTER TABLE "answers" DROP COLUMN IF EXISTS "operand1";
ALTER TABLE "answers" DROP COLUMN IF EXISTS "operand2";
ALTER TABLE "answers" DROP COLUMN IF EXISTS "user_answer";
ALTER TABLE "answers" DROP COLUMN IF EXISTS "correct_answer";

-- Step 6: Rename new columns to original names
ALTER TABLE "answers" RENAME COLUMN "new_user_answer" TO "user_answer";
ALTER TABLE "answers" RENAME COLUMN "new_correct_answer" TO "correct_answer";