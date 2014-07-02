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
                "dbo.OrganizationElement",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganizationId = c.Int(nullable: false),
                        ElementId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .ForeignKey("dbo.Organization", t => t.OrganizationId, cascadeDelete: false)
                .Index(t => t.OrganizationId)
                .Index(t => t.ElementId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.OrganizationElement", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.OrganizationElement", "ElementId", "dbo.Element");
            DropForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropIndex("dbo.OrganizationElement", new[] { "ElementId" });
            DropIndex("dbo.OrganizationElement", new[] { "OrganizationId" });
            DropIndex("dbo.OrganizationElementItem", new[] { "ElementItemId" });
            DropIndex("dbo.OrganizationElementItem", new[] { "OrganizationId" });
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropTable("dbo.OrganizationElement");
            DropTable("dbo.OrganizationElementItem");
            DropTable("dbo.ElementItem");
            DropTable("dbo.Element");
        }
    }
}
