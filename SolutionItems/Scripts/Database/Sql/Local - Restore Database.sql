/*********** Script for restoring a backup from a backup file - SH - 22 Nov. '14 ***************/

/* Not yet tested */

--Variable
DECLARE @path VARCHAR(256) -- Path for the backup file

--Assign the value
SET @path = 'D:\Development\Databases\Backup\WealthEconomy\live\WealthEconomy_20141122.bak'

--Display the details of the backup file
RESTORE FILELISTONLY
FROM DISK = @path

--Restore the db to LocalDb path
RESTORE DATABASE [WealthEconomy]
FROM DISK = @path
WITH MOVE 'WealthEconomy_Data' TO 'D:\Development\Databases\Data\WealthEconomy.MDF',
MOVE 'WealthEconomy_Log' TO 'D:\Development\Databases\Data\WealthEconomy_1.LDF'
GO
