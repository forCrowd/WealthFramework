SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

update UserResourcePool set ResourcePoolRate = ResourcePoolRate * 100

COMMIT;
RAISERROR (N'Script: 1.....Done!', 10, 1) WITH NOWAIT;
GO
