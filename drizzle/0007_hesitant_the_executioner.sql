CREATE TABLE `agent_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentType` varchar(100) NOT NULL,
	`action` varchar(255) NOT NULL,
	`context` text,
	`result` text,
	`severity` varchar(20) NOT NULL DEFAULT 'info',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`company` varchar(255),
	`title` varchar(255),
	`category` varchar(100) NOT NULL,
	`relationship` varchar(100),
	`lastContactedAt` timestamp,
	`nextFollowUpAt` timestamp,
	`notes` text,
	`linkedCardKey` varchar(100),
	`importance` int DEFAULT 3,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(1000) NOT NULL,
	`fileSize` int NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`category` varchar(100),
	`linkedCardKey` varchar(100),
	`linkedContactId` int,
	`tags` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
