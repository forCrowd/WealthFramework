/*********** Script for taking a backup of the database - coni2k - 23 Feb. '16 ***************/

--Variables
DECLARE @path VARCHAR(250) -- path for backup files 
DECLARE @dbName VARCHAR(50) -- database name 
DECLARE @fileDate VARCHAR(20) -- file date
DECLARE @fileTime VARCHAR(20) -- file time
DECLARE @fileName VARCHAR(250) -- filename for backup 

--Assign the values
SET @path = '$(path)'
SET @dbName = '$(dbName)'
SET @fileDate = CONVERT(VARCHAR(20), GETDATE(), 112)
SET @fileTime = REPLACE(CONVERT(VARCHAR(20), GETDATE(), 114), ':', '')
SET @fileName = @path + @dbName + '_' + @fileDate + '_' + @fileTime + '.bak' 

--Backup the database
BACKUP DATABASE @dbName TO DISK = @fileName

PRINT CHAR(10) + N'WealthEconomy - "Backup Database.sql" script file has been executed!';
GO
