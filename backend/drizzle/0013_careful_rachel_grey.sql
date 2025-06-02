ALTER TABLE `UserLogs` DROP FOREIGN KEY `UserLogs_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `UserLogs` ADD CONSTRAINT `UserLogs_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE set null ON UPDATE no action;