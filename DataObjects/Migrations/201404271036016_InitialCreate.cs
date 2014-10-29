namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.License",
                c => new
                    {
                        Id = c.Short(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        Text = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId)
                .Index(t => t.ResourcePoolId);
            
            CreateTable(
                "dbo.Organization",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        SectorId = c.Short(nullable: false),
                        Name = c.String(nullable: false),
                        ProductionCost = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SalesPrice = c.Decimal(nullable: false, precision: 18, scale: 2),
                        LicenseId = c.Short(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.License", t => t.LicenseId)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId)
                .ForeignKey("dbo.Sector", t => t.SectorId)
                .Index(t => t.ResourcePoolId)
                .Index(t => t.SectorId)
                .Index(t => t.LicenseId);
            
            CreateTable(
                "dbo.ResourcePool",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sector",
                c => new
                    {
                        Id = c.Short(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId)
                .Index(t => t.ResourcePoolId);
            
            CreateTable(
                "dbo.UserSectorRating",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        SectorId = c.Short(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Sector", t => t.SectorId)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.SectorId);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: false),
                        Email = c.String(nullable: false),
                        Password = c.String(nullable: false),
                        FirstName = c.String(),
                        MiddleName = c.String(),
                        LastName = c.String(),
                        UserAccountTypeId = c.Byte(nullable: false),
                        Notes = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserLicenseRating",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        LicenseId = c.Short(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.License", t => t.LicenseId)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.LicenseId);
            
            CreateTable(
                "dbo.UserOrganization",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        OrganizationId = c.Int(nullable: false),
                        NumberOfSales = c.Int(nullable: false),
                        QualityRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CustomerSatisfactionRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        EmployeeSatisfactionRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organization", t => t.OrganizationId)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.OrganizationId);
            
            CreateTable(
                "dbo.UserResourcePool",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ResourcePoolId = c.Int(nullable: false),
                        ResourcePoolRate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TotalCostIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        KnowledgeIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        QualityIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SectorIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        EmployeeSatisfactionIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CustomerSatisfactionIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        DistanceIndexRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.ResourcePoolId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSectorRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserOrganization", "UserId", "dbo.User");
            DropForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License");
            DropForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.Organization", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.Organization", "LicenseId", "dbo.License");
            DropIndex("dbo.UserResourcePool", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserResourcePool", new[] { "UserId" });
            DropIndex("dbo.UserOrganization", new[] { "OrganizationId" });
            DropIndex("dbo.UserOrganization", new[] { "UserId" });
            DropIndex("dbo.UserLicenseRating", new[] { "LicenseId" });
            DropIndex("dbo.UserLicenseRating", new[] { "UserId" });
            DropIndex("dbo.UserSectorRating", new[] { "SectorId" });
            DropIndex("dbo.UserSectorRating", new[] { "UserId" });
            DropIndex("dbo.Sector", new[] { "ResourcePoolId" });
            DropIndex("dbo.Organization", new[] { "LicenseId" });
            DropIndex("dbo.Organization", new[] { "SectorId" });
            DropIndex("dbo.Organization", new[] { "ResourcePoolId" });
            DropIndex("dbo.License", new[] { "ResourcePoolId" });
            DropTable("dbo.UserResourcePool");
            DropTable("dbo.UserOrganization");
            DropTable("dbo.UserLicenseRating");
            DropTable("dbo.User");
            DropTable("dbo.UserSectorRating");
            DropTable("dbo.Sector");
            DropTable("dbo.ResourcePool");
            DropTable("dbo.Organization");
            DropTable("dbo.License");
        }
    }
}
