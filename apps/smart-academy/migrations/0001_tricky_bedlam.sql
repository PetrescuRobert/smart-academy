ALTER TABLE "courses" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "id" DROP DEFAULT;