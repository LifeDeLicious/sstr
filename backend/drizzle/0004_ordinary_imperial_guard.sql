ALTER TABLE `Analysis` ADD `TrackID` int;--> statement-breakpoint
ALTER TABLE `Analysis` ADD `CarID` int;--> statement-breakpoint
ALTER TABLE `Analysis` ADD CONSTRAINT `Analysis_TrackID_Tracks_TrackID_fk` FOREIGN KEY (`TrackID`) REFERENCES `Tracks`(`TrackID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Analysis` ADD CONSTRAINT `Analysis_CarID_Cars_CarID_fk` FOREIGN KEY (`CarID`) REFERENCES `Cars`(`CarID`) ON DELETE no action ON UPDATE no action;