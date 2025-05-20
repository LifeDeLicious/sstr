ALTER TABLE `Laps` DROP FOREIGN KEY `Laps_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `Laps` ADD CONSTRAINT `Laps_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE cascade ON UPDATE no action;