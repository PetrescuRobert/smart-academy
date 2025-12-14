CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"active" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar NOT NULL
);
