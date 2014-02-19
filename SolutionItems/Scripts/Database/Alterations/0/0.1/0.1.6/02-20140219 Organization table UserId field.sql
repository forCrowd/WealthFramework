SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

-- Add UserId field to Organization table
ALTER TABLE [dbo].[Organization] ADD [UserId] [int] NULL
GO

-- Update UserId field with UserId = 1
UPDATE [Organization] SET UserId = 1
GO

-- Update UserId field to NOT NULL
ALTER TABLE [dbo].[Organization] ALTER COLUMN [UserId] [int] NOT NULL

-- UserId foreign key
ALTER TABLE [dbo].[Organization]  WITH CHECK ADD  CONSTRAINT [FK_Organization_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

ALTER TABLE [dbo].[Organization] CHECK CONSTRAINT [FK_Organization_User]
GO

-- Copy Organization records to other users
INSERT INTO [dbo].[Organization] (UserId, SectorId, Name, ProductionCost, SalesPrice, LicenseId, NumberOfSales, CreatedOn, ModifiedOn, DeletedOn)
SELECT T2.Id, SectorId, Name, ProductionCost, SalesPrice, LicenseId, NumberOfSales, T2.CreatedOn, T2.ModifiedOn, T2.DeletedOn
	FROM [Organization] AS T1
	CROSS JOIN [User] AS T2
	WHERE T2.Id <> 1
GO

-- Copy organization rating records to other users
INSERT INTO [dbo].[UserOrganizationRating] (UserId, OrganizationId, QualityRating, EmployeeSatisfactionRating, CustomerSatisfactionRating, CreatedOn, ModifiedOn, DeletedOn)
SELECT T2.Id, OrganizationId, QualityRating, EmployeeSatisfactionRating, CustomerSatisfactionRating, T2.CreatedOn, T2.ModifiedOn, T2.DeletedOn
	FROM [UserOrganizationRating] AS T1
	CROSS JOIN [User] AS T2
	WHERE T2.Id <> 1
GO

-- Create default license rating records
INSERT INTO [dbo].[UserLicenseRating] (UserId, LicenseId, Rating, CreatedOn, ModifiedOn, DeletedOn)
SELECT T2.Id, T1.Id, 0, T2.CreatedOn, T2.ModifiedOn, T2.DeletedOn
	FROM [License] AS T1
	CROSS JOIN [User] AS T2
	WHERE T2.Id <> 1
GO

-- Create default sector rating records
INSERT INTO [dbo].[UserSectorRating] (UserId, SectorId, Rating, CreatedOn, ModifiedOn, DeletedOn)
SELECT T2.Id, T1.Id, 0, T2.CreatedOn, T2.ModifiedOn, T2.DeletedOn
	FROM [Sector] AS T1
	CROSS JOIN [User] AS T2
	WHERE T2.Id <> 1
GO

COMMIT;
RAISERROR (N'Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
