/*********** Script for updating server related values, after restoring a backup from another server / SH - 06 Mar. '14 ***************/

/* Begin */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO
BEGIN TRANSACTION;

/* Remove doktorasizlar tables */

-- Stored procedures

declare @procName varchar(500)
declare cur cursor 

for select [name] from sys.objects where type = 'p' and create_date < '2010-1-1'
open cur
fetch next from cur into @procName
while @@fetch_status = 0
begin
    exec('drop procedure ' + @procName)
    fetch next from cur into @procName
end
close cur
deallocate cur

-- Views


GO

/****** Object:  View [dbo].[Users_View]    Script Date: 03/13/2014 12:31:13 ******/
IF  EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[dbo].[Users_View]'))
DROP VIEW [dbo].[Users_View]
GO

-- Tables


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_BloodAnnouncements_BloodTypes]') AND parent_object_id = OBJECT_ID(N'[dbo].[BloodAnnouncements]'))
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [FK_BloodAnnouncements_BloodTypes]
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_BloodAnnouncements_Cities]') AND parent_object_id = OBJECT_ID(N'[dbo].[BloodAnnouncements]'))
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [FK_BloodAnnouncements_Cities]
GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_BloodAnnouncements_IsActive]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [DF_BloodAnnouncements_IsActive]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_BloodAnnouncements_IsDeleted]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [DF_BloodAnnouncements_IsDeleted]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_BloodAnnouncements_CreatedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [DF_BloodAnnouncements_CreatedDate]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_BloodAnnouncements_ModifiedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[BloodAnnouncements] DROP CONSTRAINT [DF_BloodAnnouncements_ModifiedDate]
END

GO


GO

/****** Object:  Table [dbo].[BloodAnnouncements]    Script Date: 03/13/2014 12:22:31 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BloodAnnouncements]') AND type in (N'U'))
DROP TABLE [dbo].[BloodAnnouncements]
GO

---


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comments_Webpages]') AND parent_object_id = OBJECT_ID(N'[dbo].[Comments]'))
ALTER TABLE [dbo].[Comments] DROP CONSTRAINT [FK_Comments_Webpages]
GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Comments_IsActive]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Comments] DROP CONSTRAINT [DF_Comments_IsActive]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Comments_IsDeleted]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Comments] DROP CONSTRAINT [DF_Comments_IsDeleted]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Comments_CreatedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Comments] DROP CONSTRAINT [DF_Comments_CreatedDate]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Comments_ModifiedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Comments] DROP CONSTRAINT [DF_Comments_ModifiedDate]
END

GO


GO

/****** Object:  Table [dbo].[Comments]    Script Date: 03/13/2014 12:23:33 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Comments]') AND type in (N'U'))
DROP TABLE [dbo].[Comments]
GO

---


GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Dices_CreatedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Dices] DROP CONSTRAINT [DF_Dices_CreatedOn]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Dices_ModifiedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Dices] DROP CONSTRAINT [DF_Dices_ModifiedOn]
END

GO


GO

/****** Object:  Table [dbo].[Dices]    Script Date: 03/13/2014 12:23:54 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dices]') AND type in (N'U'))
DROP TABLE [dbo].[Dices]
GO

---


GO

/****** Object:  Table [dbo].[Links]    Script Date: 03/13/2014 12:24:01 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Links]') AND type in (N'U'))
DROP TABLE [dbo].[Links]
GO

---


GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Results_CreatedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Results] DROP CONSTRAINT [DF_Results_CreatedOn]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Results_ModifiedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Results] DROP CONSTRAINT [DF_Results_ModifiedOn]
END

GO


GO

/****** Object:  Table [dbo].[Results]    Script Date: 03/13/2014 12:24:08 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Results]') AND type in (N'U'))
DROP TABLE [dbo].[Results]
GO

---


GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Supported_IsActive]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Supported] DROP CONSTRAINT [DF_Supported_IsActive]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Supported_IsDeleted]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Supported] DROP CONSTRAINT [DF_Supported_IsDeleted]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Supported_CreatedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Supported] DROP CONSTRAINT [DF_Supported_CreatedDate]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Supported_ModifiedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Supported] DROP CONSTRAINT [DF_Supported_ModifiedDate]
END

GO


GO

/****** Object:  Table [dbo].[Supported]    Script Date: 03/13/2014 12:24:19 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Supported]') AND type in (N'U'))
DROP TABLE [dbo].[Supported]
GO

---


GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_Id]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_Users_Id]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_CreatedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_Users_CreatedOn]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_ModifiedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_Users_ModifiedOn]
END

GO


GO

/****** Object:  Table [dbo].[Users]    Script Date: 03/13/2014 12:24:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
DROP TABLE [dbo].[Users]
GO

---


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UsersDBActions_DBActions]') AND parent_object_id = OBJECT_ID(N'[dbo].[UsersDBActions]'))
ALTER TABLE [dbo].[UsersDBActions] DROP CONSTRAINT [FK_UsersDBActions_DBActions]
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UsersDBActions_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[UsersDBActions]'))
ALTER TABLE [dbo].[UsersDBActions] DROP CONSTRAINT [FK_UsersDBActions_Users]
GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_UsersDBActions_ActionDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UsersDBActions] DROP CONSTRAINT [DF_UsersDBActions_ActionDate]
END

GO


GO

/****** Object:  Table [dbo].[UsersDBActions]    Script Date: 03/13/2014 12:24:43 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UsersDBActions]') AND type in (N'U'))
DROP TABLE [dbo].[UsersDBActions]
GO

---


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UsersRoles_Roles]') AND parent_object_id = OBJECT_ID(N'[dbo].[UsersRoles]'))
ALTER TABLE [dbo].[UsersRoles] DROP CONSTRAINT [FK_UsersRoles_Roles]
GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UsersRoles_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[UsersRoles]'))
ALTER TABLE [dbo].[UsersRoles] DROP CONSTRAINT [FK_UsersRoles_Users]
GO


GO

/****** Object:  Table [dbo].[UsersRoles]    Script Date: 03/13/2014 12:24:50 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UsersRoles]') AND type in (N'U'))
DROP TABLE [dbo].[UsersRoles]
GO

---


GO

/****** Object:  Table [dbo].[Webpages]    Script Date: 03/13/2014 12:24:56 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Webpages]') AND type in (N'U'))
DROP TABLE [dbo].[Webpages]
GO

---


GO

/****** Object:  Table [dbo].[DBActions]    Script Date: 03/13/2014 12:23:47 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DBActions]') AND type in (N'U'))
DROP TABLE [dbo].[DBActions]
GO

---


GO

/****** Object:  Table [dbo].[Roles]    Script Date: 03/13/2014 12:24:15 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
DROP TABLE [dbo].[Roles]
GO

---


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Users_BloodTypes]') AND parent_object_id = OBJECT_ID(N'[dbo].[Users_Kizilkale_Old]'))
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [FK_Users_BloodTypes]
GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_PasswordLastModifiedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_PasswordLastModifiedDate]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_EmailIsValid]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_EmailIsValid]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_IsActive]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_IsActive]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_IsDeleted]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_IsDeleted]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_CreatedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_CreatedDate]
END

GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Users_ModifiedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users_Kizilkale_Old] DROP CONSTRAINT [DF_Users_ModifiedDate]
END

GO


GO

/****** Object:  Table [dbo].[Users_Kizilkale_Old]    Script Date: 03/13/2014 12:24:36 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users_Kizilkale_Old]') AND type in (N'U'))
DROP TABLE [dbo].[Users_Kizilkale_Old]
GO

---


GO

/****** Object:  Table [dbo].[BloodTypes]    Script Date: 03/13/2014 12:22:47 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BloodTypes]') AND type in (N'U'))
DROP TABLE [dbo].[BloodTypes]
GO

---


GO

IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Cities_Countries]') AND parent_object_id = OBJECT_ID(N'[dbo].[Cities]'))
ALTER TABLE [dbo].[Cities] DROP CONSTRAINT [FK_Cities_Countries]
GO


GO

/****** Object:  Table [dbo].[Cities]    Script Date: 03/13/2014 12:23:22 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cities]') AND type in (N'U'))
DROP TABLE [dbo].[Cities]
GO

---


GO

/****** Object:  Table [dbo].[Countries]    Script Date: 03/13/2014 12:23:40 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Countries]') AND type in (N'U'))
DROP TABLE [dbo].[Countries]
GO

/* Remove doktorasizlar tables end */
	
/* End */
COMMIT;
PRINT CHAR(10) + N'WealthEconomy - "Local - Update Content.sql" script file has been successfully executed!'
GO
