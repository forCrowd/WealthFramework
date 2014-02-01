SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

EXEC sp_RENAME '[UserDistributionIndexRating].[EmployeeIndexRating]' , 'EmployeeSatisfactionIndexRating', 'COLUMN'
EXEC sp_RENAME '[UserDistributionIndexRating].[CustomerIndexRating]' , 'CustomerSatisfactionIndexRating', 'COLUMN'

COMMIT;
RAISERROR (N'Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
