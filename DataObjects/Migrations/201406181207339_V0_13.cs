namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_13 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ResourcePoolIndex",
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
                "dbo.UserResourcePoolIndexValue",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserResourcePoolIndexId = c.Int(nullable: false),
                        OrganizationId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organization", t => t.OrganizationId, cascadeDelete: false)
                .ForeignKey("dbo.UserResourcePoolIndex", t => t.UserResourcePoolIndexId, cascadeDelete: true)
                .Index(t => new { t.UserResourcePoolIndexId, t.OrganizationId }, unique: true, name: "IX_UserResourcePoolIndexIdOrganizationId");
            
            CreateTable(
                "dbo.UserResourcePoolIndex",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserResourcePoolId = c.Int(nullable: false),
                        ResourcePoolIndexId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePoolIndex", t => t.ResourcePoolIndexId, cascadeDelete: false)
                .ForeignKey("dbo.UserResourcePool", t => t.UserResourcePoolId, cascadeDelete: true)
                .Index(t => new { t.UserResourcePoolId, t.ResourcePoolIndexId }, unique: true, name: "IX_UserResourcePoolIdResourcePoolIndexId");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserResourcePoolIndexValue", "UserResourcePoolIndexId", "dbo.UserResourcePoolIndex");
            DropForeignKey("dbo.UserResourcePoolIndex", "UserResourcePoolId", "dbo.UserResourcePool");
            DropForeignKey("dbo.UserResourcePoolIndex", "ResourcePoolIndexId", "dbo.ResourcePoolIndex");
            DropForeignKey("dbo.UserResourcePoolIndexValue", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.ResourcePoolIndex", "ResourcePoolId", "dbo.ResourcePool");
            DropIndex("dbo.UserResourcePoolIndex", "IX_UserResourcePoolIdResourcePoolIndexId");
            DropIndex("dbo.UserResourcePoolIndexValue", "IX_UserResourcePoolIndexIdOrganizationId");
            DropIndex("dbo.ResourcePoolIndex", new[] { "ResourcePoolId" });
            DropTable("dbo.UserResourcePoolIndex");
            DropTable("dbo.UserResourcePoolIndexValue");
            DropTable("dbo.ResourcePoolIndex");
        }
    }
}
