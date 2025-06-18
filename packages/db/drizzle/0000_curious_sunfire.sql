CREATE TABLE `result` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`package` text NOT NULL,
	`is_success` integer NOT NULL,
	`num_trace` integer NOT NULL,
	`num_type` integer NOT NULL,
	`num_hot_spot` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`duration_ms_hot_spot` integer NOT NULL,
	`error` text,
	`scan_id` integer NOT NULL,
	FOREIGN KEY (`scan_id`) REFERENCES `scan`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_result_scanId_package` ON `result` (`scan_id`,`package`);--> statement-breakpoint
CREATE TABLE `scan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`repository` text NOT NULL,
	`commit_hash` text NOT NULL,
	`commit_message` text NOT NULL,
	`commit_data` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_scan_repository_commit_hash` ON `scan` (`repository`,`commit_hash`);