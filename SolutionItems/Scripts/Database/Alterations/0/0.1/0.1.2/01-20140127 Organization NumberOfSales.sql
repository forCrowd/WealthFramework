SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

ALTER TABLE [dbo].[Organization] ADD [NumberOfSales] [int] NOT NULL CONSTRAINT [DF_Organization_NumberOfSales] DEFAULT ((0))
GO

-- Update field positions accordingly
/*
LicenseId	smallint	Unchecked
NumberOfSales	int	Unchecked
CreatedOn	datetime	Unchecked
*/

COMMIT;
RAISERROR (N'Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
