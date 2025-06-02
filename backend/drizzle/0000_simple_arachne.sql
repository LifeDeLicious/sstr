CREATE TABLE `Analysis` (
	`AnalysisID` int AUTO_INCREMENT NOT NULL,
	`AnalysisName` varchar(255) NOT NULL,
	`IsAnalysisPublic` boolean NOT NULL DEFAULT false,
	`AnalysisDate` timestamp DEFAULT (now()),
	CONSTRAINT `Analysis_AnalysisID` PRIMARY KEY(`AnalysisID`)
);
--> statement-breakpoint
CREATE TABLE `AnalysisLaps` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`AnalysisID` int,
	`LapID` int,
	CONSTRAINT `AnalysisLaps_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `Cars` (
	`CarID` int AUTO_INCREMENT NOT NULL,
	`CarModel` varchar(128),
	`CarManufacturer` varchar(64),
	`CarAssetName` varchar(128) NOT NULL,
	CONSTRAINT `Cars_CarID` PRIMARY KEY(`CarID`)
);
--> statement-breakpoint
CREATE TABLE `Laps` (
	`LapID` int AUTO_INCREMENT NOT NULL,
	`UserID` int,
	`LapFileName` varchar(255) NOT NULL,
	`LapTime` double NOT NULL,
	`SessionID` int,
	`IsFastestLapOfSession` boolean,
	`LapOfSession` int NOT NULL,
	CONSTRAINT `Laps_LapID` PRIMARY KEY(`LapID`)
);
--> statement-breakpoint
CREATE TABLE `Sessions` (
	`SessionID` int AUTO_INCREMENT NOT NULL,
	`UserID` int,
	`CarID` int,
	`TrackID` int,
	`DateTime` timestamp NOT NULL DEFAULT (now()),
	`TrackTemperature` varchar(4) NOT NULL,
	`AirTemperature` varchar(4) NOT NULL,
	`FastestLapTime` double NOT NULL,
	CONSTRAINT `Sessions_SessionID` PRIMARY KEY(`SessionID`)
);
--> statement-breakpoint
CREATE TABLE `Tracks` (
	`TrackID` int AUTO_INCREMENT NOT NULL,
	`TrackName` varchar(255),
	`TrackAssetName` varchar(256) NOT NULL,
	`TrackImageAssetName` varchar(256),
	CONSTRAINT `Tracks_TrackID` PRIMARY KEY(`TrackID`)
);
--> statement-breakpoint
CREATE TABLE `UserAnalysis` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`AnalysisID` int,
	`UserID` int,
	CONSTRAINT `UserAnalysis_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `UserLogs` (
	`UserID` int,
	`EventType` varchar(50) NOT NULL,
	`AnalysisDate` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`UserID` int AUTO_INCREMENT NOT NULL,
	`Username` varchar(128) NOT NULL,
	`Email` varchar(128) NOT NULL,
	`PasswordHash` varchar(255) NOT NULL,
	`DateRegistered` timestamp NOT NULL DEFAULT (now()),
	`IsAdmin` boolean NOT NULL DEFAULT false,
	CONSTRAINT `Users_UserID` PRIMARY KEY(`UserID`)
);
--> statement-breakpoint
CREATE TABLE `UserSessions` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`SessionID` int,
	`UserID` int,
	CONSTRAINT `UserSessions_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
ALTER TABLE `AnalysisLaps` ADD CONSTRAINT `AnalysisLaps_AnalysisID_Analysis_AnalysisID_fk` FOREIGN KEY (`AnalysisID`) REFERENCES `Analysis`(`AnalysisID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `AnalysisLaps` ADD CONSTRAINT `AnalysisLaps_LapID_Laps_LapID_fk` FOREIGN KEY (`LapID`) REFERENCES `Laps`(`LapID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Laps` ADD CONSTRAINT `Laps_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Laps` ADD CONSTRAINT `Laps_SessionID_Sessions_SessionID_fk` FOREIGN KEY (`SessionID`) REFERENCES `Sessions`(`SessionID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_CarID_Cars_CarID_fk` FOREIGN KEY (`CarID`) REFERENCES `Cars`(`CarID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_TrackID_Tracks_TrackID_fk` FOREIGN KEY (`TrackID`) REFERENCES `Tracks`(`TrackID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_AnalysisID_Analysis_AnalysisID_fk` FOREIGN KEY (`AnalysisID`) REFERENCES `Analysis`(`AnalysisID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserAnalysis` ADD CONSTRAINT `UserAnalysis_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserLogs` ADD CONSTRAINT `UserLogs_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserSessions` ADD CONSTRAINT `UserSessions_SessionID_Sessions_SessionID_fk` FOREIGN KEY (`SessionID`) REFERENCES `Sessions`(`SessionID`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserSessions` ADD CONSTRAINT `UserSessions_UserID_Users_UserID_fk` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE no action ON UPDATE no action;