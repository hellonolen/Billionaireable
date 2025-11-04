CREATE TABLE `behavioral_patterns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`patternType` varchar(50) NOT NULL,
	`patternName` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`confidence` int NOT NULL,
	`firstDetected` timestamp NOT NULL,
	`lastDetected` timestamp NOT NULL,
	`occurrences` int DEFAULT 1,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `behavioral_patterns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`location` varchar(500),
	`attendees` text,
	`eventType` varchar(50),
	`isAllDay` boolean DEFAULT false,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `calendar_events_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
CREATE TABLE `communication_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`relationshipId` int,
	`eventType` varchar(50) NOT NULL,
	`contactEmail` varchar(320),
	`contactName` varchar(255),
	`subject` text,
	`summary` text,
	`sentiment` varchar(20),
	`eventDate` timestamp NOT NULL,
	`duration` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communication_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`messageId` varchar(255) NOT NULL,
	`threadId` varchar(255),
	`fromEmail` varchar(320) NOT NULL,
	`toEmails` text NOT NULL,
	`ccEmails` text,
	`subject` text,
	`bodyText` text,
	`bodyHtml` text,
	`sentAt` timestamp NOT NULL,
	`receivedAt` timestamp,
	`isSent` boolean DEFAULT false,
	`isRead` boolean DEFAULT false,
	`labels` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_messages_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `key_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(50),
	`relationshipType` varchar(50),
	`importanceLevel` int DEFAULT 5,
	`minContactFrequency` int DEFAULT 7,
	`lastContactDate` timestamp,
	`totalInteractions` int DEFAULT 0,
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `key_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relationship_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`relationshipId` int,
	`insightType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`priority` varchar(20) DEFAULT 'medium',
	`actionSuggested` text,
	`isActioned` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `relationship_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `behavioral_patterns` ADD CONSTRAINT `behavioral_patterns_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `calendar_events` ADD CONSTRAINT `calendar_events_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communication_events` ADD CONSTRAINT `communication_events_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communication_events` ADD CONSTRAINT `communication_events_relationshipId_key_relationships_id_fk` FOREIGN KEY (`relationshipId`) REFERENCES `key_relationships`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_messages` ADD CONSTRAINT `email_messages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `key_relationships` ADD CONSTRAINT `key_relationships_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `relationship_insights` ADD CONSTRAINT `relationship_insights_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `relationship_insights` ADD CONSTRAINT `relationship_insights_relationshipId_key_relationships_id_fk` FOREIGN KEY (`relationshipId`) REFERENCES `key_relationships`(`id`) ON DELETE no action ON UPDATE no action;