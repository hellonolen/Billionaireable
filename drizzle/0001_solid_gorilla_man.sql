CREATE TABLE `dashboard_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sectionKey` varchar(100) NOT NULL,
	`data` text NOT NULL,
	`cadence` varchar(20) NOT NULL DEFAULT 'Monthly',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dashboard_sections_id` PRIMARY KEY(`id`)
);
