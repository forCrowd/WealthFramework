SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;
INSERT INTO [dbo].[UserResourcePoolOrganization]([UserId], ResourcePoolOrganizationId, [NumberOfSales], [QualityRating], [CustomerSatisfactionRating], [EmployeeSatisfactionRating])
SELECT  T1.Id, T2.Id, 0, 0, 0, 0 FROM    [User] T1
	CROSS JOIN ResourcePoolOrganization T2

COMMIT;
RAISERROR (N'[dbo].[UserResourcePoolOrganization]: Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
