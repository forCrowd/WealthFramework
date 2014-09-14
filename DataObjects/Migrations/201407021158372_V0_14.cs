namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Organization", "LicenseId", "dbo.License");
            DropForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License");
            DropForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User");
            DropIndex("dbo.License", new[] { "ResourcePoolId" });
            DropIndex("dbo.Organization", new[] { "LicenseId" });
            DropIndex("dbo.UserLicenseRating", new[] { "UserId" });
            DropIndex("dbo.UserLicenseRating", new[] { "LicenseId" });
            DropIndex("dbo.UserOrganization", new[] { "UserId" });
            DropIndex("dbo.UserOrganization", new[] { "OrganizationId" });
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
            
            AddColumn("dbo.ResourcePoolIndex", "ElementId", c => c.Int());
            CreateIndex("dbo.ResourcePoolIndex", "ElementId");
            CreateIndex("dbo.UserOrganization", new[] { "UserId", "OrganizationId" }, unique: true, name: "IX_UserIdOrganizationId");
            AddForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element", "Id");
            DropColumn("dbo.Organization", "LicenseId");
            DropTable("dbo.License");
            DropTable("dbo.UserLicenseRating");
        }
        
        public override void Down()
        {
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
            DropForeignKey("dbo.UserElementItem", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element");
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropIndex("dbo.UserOrganization", "IX_UserIdOrganizationId");
            DropIndex("dbo.UserElementItem", "IX_UserIdElementItemId");
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementId" });
            DropIndex("dbo.OrganizationElementItem", "IX_OrganizationIdElementItemId");
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropColumn("dbo.ResourcePoolIndex", "ElementId");
            DropTable("dbo.UserElementItem");
            DropTable("dbo.OrganizationElementItem");
            DropTable("dbo.ElementItem");
            DropTable("dbo.Element");
            CreateIndex("dbo.UserOrganization", "OrganizationId");
            CreateIndex("dbo.UserOrganization", "UserId");
            CreateIndex("dbo.UserLicenseRating", "LicenseId");
            CreateIndex("dbo.UserLicenseRating", "UserId");
            CreateIndex("dbo.Organization", "LicenseId");
            CreateIndex("dbo.License", "ResourcePoolId");
            AddForeignKey("dbo.UserLicenseRating", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserLicenseRating", "LicenseId", "dbo.License", "Id", cascadeDelete: true);
            AddForeignKey("dbo.License", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "LicenseId", "dbo.License", "Id", cascadeDelete: true);
        }
    }
}
