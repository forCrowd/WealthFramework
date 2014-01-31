SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

ALTER TABLE [dbo].[User] ADD [ResourcePoolRate] [decimal] (18,2) NOT NULL CONSTRAINT [DF_User_ResourcePoolRate] DEFAULT ((0))
GO

-- Update field positions accordingly
/*
LastName	nvarchar(50)	Checked
ResourcePoolRate	decimal(18, 2)	Unchecked
CreatedOn	datetime	Unchecked
*/

COMMIT;
RAISERROR (N'Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
