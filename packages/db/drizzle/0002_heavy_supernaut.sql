ALTER TABLE `scan` ADD `version` text DEFAULT 'alpha' NOT NULL;--> statement-breakpoint
ALTER TABLE `scan` ADD `owner` text DEFAULT '' NOT NULL;