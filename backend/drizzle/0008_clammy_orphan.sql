ALTER TABLE `AnalysisLaps` DROP FOREIGN KEY `AnalysisLaps_AnalysisID_Analysis_AnalysisID_fk`;
--> statement-breakpoint
ALTER TABLE `UserAnalysis` DROP FOREIGN KEY `UserAnalysis_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `AnalysisLaps` ADD CONSTRAINT `AnalysisLaps_AnalysisID_Analysis_AnalysisID_fk` FOREIGN KEY (`AnalysisID`) REFERENCES `Analysis`(`AnalysisID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE cascade ON UPDATE no action;