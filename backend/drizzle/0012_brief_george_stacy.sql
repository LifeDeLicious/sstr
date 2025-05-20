ALTER TABLE `Laps` DROP FOREIGN KEY `Laps_SessionID_Sessions_SessionID_fk`;
--> statement-breakpoint
ALTER TABLE `UserSessions` DROP FOREIGN KEY `UserSessions_SessionID_Sessions_SessionID_fk`;
--> statement-breakpoint
ALTER TABLE `Laps` ADD CONSTRAINT `Laps_SessionID_Sessions_SessionID_fk` FOREIGN KEY (`SessionID`) REFERENCES `Sessions`(`SessionID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserSessions` ADD CONSTRAINT `UserSessions_SessionID_Sessions_SessionID_fk` FOREIGN KEY (`SessionID`) REFERENCES `Sessions`(`SessionID`) ON DELETE cascade ON UPDATE no action;