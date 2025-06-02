ALTER TABLE `UserAnalysis` DROP FOREIGN KEY `UserAnalysis_AnalysisID_Analysis_AnalysisID_fk`;
--> statement-breakpoint
ALTER TABLE `UserAnalysis` DROP FOREIGN KEY `UserAnalysis_UserID_Users_UserID_fk`;
--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_AnalysisID_Analysis_AnalysisID_fk` FOREIGN KEY (`AnalysisID`) REFERENCES `Analysis`(`AnalysisID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;