namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Organization", "LicenseId", "dbo.License");
            DropForeignKey("dbo.Organization", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License");
            DropForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User");
            DropForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector");
            DropForeignKey("dbo.UserSectorRating", "UserId", "dbo.User");
            DropForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool");
            DropIndex("dbo.License", new[] { "ResourcePoolId" });
            DropIndex("dbo.Organization", new[] { "SectorId" });
            DropIndex("dbo.Organization", new[] { "LicenseId" });
            DropIndex("dbo.Sector", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserLicenseRating", new[] { "UserId" });
            DropIndex("dbo.UserLicenseRating", new[] { "LicenseId" });
            DropIndex("dbo.UserOrganization", new[] { "UserId" });
            DropIndex("dbo.UserOrganization", new[] { "OrganizationId" });
            DropIndex("dbo.UserSectorRating", new[] { "UserId" });
            DropIndex("dbo.UserSectorRating", new[] { "SectorId" });
            CreateTable(
                "dbo.Element",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: true)
                .Index(t => t.ResourcePoolId);
            
            CreateTable(
                "dbo.ElementItem",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                        ElementId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .Index(t => t.ElementId);
            
            CreateTable(
                "dbo.OrganizationElementItem",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganizationId = c.Int(nullable: false),
                        ElementItemId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .ForeignKey("dbo.Organization", t => t.OrganizationId, cascadeDelete: false)
                .Index(t => new { t.OrganizationId, t.ElementItemId }, unique: true, name: "IX_OrganizationIdElementItemId");
            
            CreateTable(
                "dbo.UserElementItem",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ElementItemId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: false)
                .Index(t => new { t.UserId, t.ElementItemId }, unique: true, name: "IX_UserIdElementItemId");
            
            AddColumn("dbo.Organization", "ResourcePoolId", c => c.Int(nullable: false));
            AddColumn("dbo.ResourcePoolIndex", "ElementId", c => c.Int());
            AddColumn("dbo.UserResourcePoolIndex", "User_Id", c => c.Int());
            AddColumn("dbo.UserResourcePoolIndexValue", "User_Id", c => c.Int());
            CreateIndex("dbo.Organization", "ResourcePoolId");
            CreateIndex("dbo.ResourcePoolIndex", "ElementId");
            CreateIndex("dbo.UserResourcePoolIndex", "User_Id");
            CreateIndex("dbo.UserOrganization", new[] { "UserId", "OrganizationId" }, unique: true, name: "IX_UserIdOrganizationId");
            CreateIndex("dbo.UserResourcePoolIndexValue", "User_Id");
            AddForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element", "Id");
            AddForeignKey("dbo.UserResourcePoolIndex", "User_Id", "dbo.User", "Id");
            AddForeignKey("dbo.UserResourcePoolIndexValue", "User_Id", "dbo.User", "Id");
            DropColumn("dbo.Organization", "SectorId");
            DropColumn("dbo.Organization", "LicenseId");
            DropTable("dbo.License");
            DropTable("dbo.Sector");
            DropTable("dbo.UserLicenseRating");
            DropTable("dbo.UserSectorRating");
        }
        
        public override void Down()
        {
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
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
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
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sector",
                c => new
                    {
                        Id = c.Short(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        Description = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.License",
                c => new
                    {
                        Id = c.Short(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        Description = c.String(),
                        Text = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Organization", "LicenseId", c => c.Short(nullable: false));
            AddColumn("dbo.Organization", "SectorId", c => c.Short(nullable: false));
            DropForeignKey("dbo.UserResourcePoolIndexValue", "User_Id", "dbo.User");
            DropForeignKey("dbo.UserResourcePoolIndex", "User_Id", "dbo.User");
            DropForeignKey("dbo.UserElementItem", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element");
            DropForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropIndex("dbo.UserResourcePoolIndexValue", new[] { "User_Id" });
            DropIndex("dbo.UserOrganization", "IX_UserIdOrganizationId");
            DropIndex("dbo.UserElementItem", "IX_UserIdElementItemId");
            DropIndex("dbo.UserResourcePoolIndex", new[] { "User_Id" });
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementId" });
            DropIndex("dbo.Organization", new[] { "ResourcePoolId" });
            DropIndex("dbo.OrganizationElementItem", "IX_OrganizationIdElementItemId");
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropColumn("dbo.UserResourcePoolIndexValue", "User_Id");
            DropColumn("dbo.UserResourcePoolIndex", "User_Id");
            DropColumn("dbo.ResourcePoolIndex", "ElementId");
            DropColumn("dbo.Organization", "ResourcePoolId");
            DropTable("dbo.UserElementItem");
            DropTable("dbo.OrganizationElementItem");
            DropTable("dbo.ElementItem");
            DropTable("dbo.Element");
            CreateIndex("dbo.UserSectorRating", "SectorId");
            CreateIndex("dbo.UserSectorRating", "UserId");
            CreateIndex("dbo.UserOrganization", "OrganizationId");
            CreateIndex("dbo.UserOrganization", "UserId");
            CreateIndex("dbo.UserLicenseRating", "LicenseId");
            CreateIndex("dbo.UserLicenseRating", "UserId");
            CreateIndex("dbo.Sector", "ResourcePoolId");
            CreateIndex("dbo.Organization", "LicenseId");
            CreateIndex("dbo.Organization", "SectorId");
            CreateIndex("dbo.License", "ResourcePoolId");
            AddForeignKey("dbo.Sector", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserSectorRating", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserSectorRating", "SectorId", "dbo.Sector", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License", "Id", cascadeDelete: true);
            AddForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "SectorId", "dbo.Sector", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "LicenseId", "dbo.License", "Id", cascadeDelete: true);
        }
    }
}
