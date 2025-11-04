CREATE TABLE `health_biomarkers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`biomarkerType` varchar(100) NOT NULL,
	`value` varchar(50) NOT NULL,
	`unit` varchar(20) NOT NULL,
	`optimalMin` varchar(50),
	`optimalMax` varchar(50),
	`status` varchar(20) NOT NULL,
	`trend` varchar(20),
	`measuredAt` timestamp NOT NULL,
	`source` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `health_biomarkers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `share_access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareId` int NOT NULL,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	`userAgent` text,
	`wasPasswordRequired` boolean NOT NULL DEFAULT false,
	`wasSuccessful` boolean NOT NULL DEFAULT true,
	CONSTRAINT `share_access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `metrics_data` MODIFY COLUMN `value` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_rules` MODIFY COLUMN `threshold` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `pricing_plans` MODIFY COLUMN `price` int NOT NULL;--> statement-breakpoint
ALTER TABLE `shared_dashboards` ADD `shareType` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `shared_dashboards` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `shared_dashboards` ADD `revokedAt` timestamp;--> statement-breakpoint
ALTER TABLE `shared_dashboards` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;