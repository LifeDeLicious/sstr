ALTER TABLE `Sessions` DROP FOREIGN KEY `Sessions_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `UserAnalysis` DROP FOREIGN KEY `UserAnalysis_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `UserSessions` DROP FOREIGN KEY `UserSessions_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserSessions` ADD CONSTRAINT `UserSessions_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE cascade ON UPDATE no action;