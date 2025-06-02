ALTER TABLE `AnalysisLaps` DROP FOREIGN KEY `AnalysisLaps_LapID_Laps_LapID_fk`;
--> statement-breakpoint
ALTER TABLE `AnalysisLaps` ADD CONSTRAINT `AnalysisLaps_LapID_Laps_LapID_fk` FOREIGN KEY (`LapID`) REFERENCES `Laps`(`LapID`) ON DELETE cascade ON UPDATE no action;