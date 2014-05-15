namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_11_6 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Organization", "LicenseId", "dbo.License");
            DropForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License");
            DropForeignKey("dbo.Organization", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserOrganization", "UserId", "dbo.User");
            DropForeignKey("dbo.UserSectorRating", "UserId", "dbo.User");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");

            AddForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "SectorId", "dbo.Sector", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "LicenseId", "dbo.License", "Id", cascadeDelete: false);
            
            AddForeignKey("dbo.UserResourcePool", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserSectorRating", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserOrganization", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization", "Id", cascadeDelete: true);

            AddForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.UserSectorRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserOrganization", "UserId", "dbo.User");
            DropForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.Organization", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License");
            DropForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.Organization", "LicenseId", "dbo.License");
            AddForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles", "Id");
            AddForeignKey("dbo.UserSectorRating", "UserId", "dbo.User", "Id");
            AddForeignKey("dbo.UserOrganization", "UserId", "dbo.User", "Id");
            AddForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User", "Id");
            AddForeignKey("dbo.UserResourcePool", "UserId", "dbo.User", "Id");
            AddForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool", "Id");
            AddForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector", "Id");
            AddForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool", "Id");
            AddForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization", "Id");
            AddForeignKey("dbo.Organization", "SectorId", "dbo.Sector", "Id");
            AddForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License", "Id");
            AddForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool", "Id");
            AddForeignKey("dbo.Organization", "LicenseId", "dbo.License", "Id");
        }
    }
}
