namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14 : DbMigration
    {
        public override void Up()
        {
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
                .Index(t => t.UserId)
                .Index(t => t.ElementItemId);
            
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
                .Index(t => t.OrganizationId)
                .Index(t => t.ElementItemId);
            
            CreateTable(
                "dbo.UserResourcePoolIndexElementItem",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserResourcePoolIndexId = c.Int(nullable: false),
                        ElementItemId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .ForeignKey("dbo.UserResourcePoolIndex", t => t.UserResourcePoolIndexId, cascadeDelete: false)
                .Index(t => t.UserResourcePoolIndexId)
                .Index(t => t.ElementItemId);
            
            CreateTable(
                "dbo.ResourcePoolOrganizationElement",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        ElementId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: false)
                .Index(t => t.ResourcePoolId)
                .Index(t => t.ElementId);
            
            AddColumn("dbo.ResourcePoolIndex", "ElementId", c => c.Int(nullable: false));
            CreateIndex("dbo.ResourcePoolIndex", "ElementId");
            AddForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element", "Id", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ResourcePoolOrganizationElement", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.ResourcePoolOrganizationElement", "ElementId", "dbo.Element");
            DropForeignKey("dbo.UserResourcePoolIndexElementItem", "UserResourcePoolIndexId", "dbo.UserResourcePoolIndex");
            DropForeignKey("dbo.UserResourcePoolIndexElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element");
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.UserElementItem", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropIndex("dbo.ResourcePoolOrganizationElement", new[] { "ElementId" });
            DropIndex("dbo.ResourcePoolOrganizationElement", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserResourcePoolIndexElementItem", new[] { "ElementItemId" });
            DropIndex("dbo.UserResourcePoolIndexElementItem", new[] { "UserResourcePoolIndexId" });
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementId" });
            DropIndex("dbo.OrganizationElementItem", new[] { "ElementItemId" });
            DropIndex("dbo.OrganizationElementItem", new[] { "OrganizationId" });
            DropIndex("dbo.UserElementItem", new[] { "ElementItemId" });
            DropIndex("dbo.UserElementItem", new[] { "UserId" });
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropColumn("dbo.ResourcePoolIndex", "ElementId");
            DropTable("dbo.ResourcePoolOrganizationElement");
            DropTable("dbo.UserResourcePoolIndexElementItem");
            DropTable("dbo.OrganizationElementItem");
            DropTable("dbo.UserElementItem");
            DropTable("dbo.ElementItem");
            DropTable("dbo.Element");
        }
    }
}
