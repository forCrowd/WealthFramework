/*********** Script for generating a login/user for sql database - SH - 06 Mar. '14 ***************/

--Drop the login first
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = N'WealthEconomy_dbo')
BEGIN
DROP LOGIN [WealthEconomy_dbo]
END

--Create the login
CREATE LOGIN [WealthEconomy_dbo] WITH PASSWORD=N'???',
	DEFAULT_DATABASE=[WealthEconomy],
	DEFAULT_LANGUAGE=[us_english],
	CHECK_EXPIRATION=OFF,
	CHECK_POLICY=OFF

--Drop the user
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = N'WealthEconomy_dbo')
BEGIN
DROP USER [WealthEconomy_dbo]
END

--Create the user
CREATE USER [WealthEconomy_dbo] FOR LOGIN [WealthEconomy_dbo] WITH DEFAULT_SCHEMA=[dbo]

--Add the user as database owner
exec sp_addrolemember N'db_owner', N'WealthEconomy_dbo'
GO

--Grant the connect permission for this user
Grant CONNECT ON Database::[WealthEconomy] TO [WealthEconomy_dbo]  
GO
