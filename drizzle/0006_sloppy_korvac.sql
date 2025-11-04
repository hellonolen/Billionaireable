CREATE TABLE `companion_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`voiceListeningEnabled` boolean NOT NULL DEFAULT true,
	`proactiveInsightsEnabled` boolean NOT NULL DEFAULT true,
	`preferredLanguage` varchar(10) NOT NULL DEFAULT 'en',
	`personalityStyle` varchar(50) NOT NULL DEFAULT 'balanced',
	`notificationFrequency` varchar(20) NOT NULL DEFAULT 'daily',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companion_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `companion_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(20) NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memory_embeddings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int,
	`content` text NOT NULL,
	`embedding` json NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `memory_embeddings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`insightType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`confidence` int NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voice_transcriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transcript` text NOT NULL,
	`duration` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voice_transcriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `companion_settings` ADD CONSTRAINT `companion_settings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memory_embeddings` ADD CONSTRAINT `memory_embeddings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memory_embeddings` ADD CONSTRAINT `memory_embeddings_conversationId_conversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_insights` ADD CONSTRAINT `user_insights_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voice_transcriptions` ADD CONSTRAINT `voice_transcriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;