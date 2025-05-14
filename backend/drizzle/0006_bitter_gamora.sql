ALTER TABLE `Analysis` MODIFY COLUMN `IsAnalysisPublic` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `Sessions` ADD `IsSessionPublic` boolean DEFAULT true NOT NULL;