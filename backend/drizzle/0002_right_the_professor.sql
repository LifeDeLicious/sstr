ALTER TABLE `Laps` RENAME COLUMN `LapFileName` TO `LapFileKey`;--> statement-breakpoint
ALTER TABLE `Laps` MODIFY COLUMN `LapFileKey` varchar(255);