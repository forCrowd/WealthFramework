/*********** Script for taking a backup of the database - SH - 06 Mar. '14 ***************/

--Variables
DECLARE @path VARCHAR(256) -- path for backup files 
DECLARE @dbName VARCHAR(50) -- database name 
DECLARE @fileDate VARCHAR(20) -- file date
DECLARE @fileTime VARCHAR(20) -- file time
DECLARE @fileName VARCHAR(256) -- filename for backup 

--Assign the values
SET @path = 'D:\Development\Databases\Backup\WealthEconomy\local\'
SET @dbName = 'WealthEconomy'
SET @fileDate = CONVERT(VARCHAR(20), GETDATE(), 112)
SET @fileTime = REPLACE(CONVERT(VARCHAR(20), GETDATE(), 114), ':', '')
SET @fileName = @path + @dbName + '_' + @fileDate + '_' + @fileTime + '.bak' 

--Backup the database
BACKUP DATABASE @dbName TO DISK = @fileName

PRINT CHAR(10) + N'WealthEconomy - "Local - Backup Database.sql" script file has been successfully executed!';
GO
