SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

ALTER TABLE [dbo].[Sector] ALTER COLUMN [Description] [nvarchar] (max) COLLATE Latin1_General_CI_AS NULL
GO
ALTER TABLE [dbo].[Sector] ALTER COLUMN [Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL
GO
ALTER TABLE [dbo].[License] ALTER COLUMN [Description] [nvarchar] (max) COLLATE Latin1_General_CI_AS NULL
GO
ALTER TABLE [dbo].[License] ALTER COLUMN [Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL
GO
ALTER TABLE [dbo].[License] ALTER COLUMN [Text] [nvarchar] (max) COLLATE Latin1_General_CI_AS NOT NULL
GO
ALTER TABLE [dbo].[Organization] ALTER COLUMN [Name] [nvarchar] (100) COLLATE Latin1_General_CI_AS NOT NULL
GO

COMMIT;
RAISERROR (N'Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
