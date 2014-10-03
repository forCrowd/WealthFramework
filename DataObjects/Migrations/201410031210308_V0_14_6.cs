namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_6 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserElementItem", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.UserElementItem", "UserId", "dbo.User");
            DropForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.UserOrganization", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePoolIndexValue", "OrganizationId", "dbo.Organization");
            DropForeignKey("dbo.UserResourcePoolIndexValue", "UserResourcePoolIndexId", "dbo.UserResourcePoolIndex");
            DropForeignKey("dbo.UserResourcePoolIndexValue", "User_Id", "dbo.User");
            DropIndex("dbo.OrganizationElementItem", "IX_OrganizationIdElementItemId");
            DropIndex("dbo.Organization", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserElementItem", "IX_UserIdElementItemId");
            DropIndex("dbo.UserOrganization", "IX_UserIdOrganizationId");
            DropIndex("dbo.UserResourcePoolIndexValue", "IX_UserResourcePoolIndexIdOrganizationId");
            DropIndex("dbo.UserResourcePoolIndexValue", new[] { "User_Id" });
            DropTable("dbo.OrganizationElementItem");
            DropTable("dbo.Organization");
            DropTable("dbo.UserElementItem");
            DropTable("dbo.UserOrganization");
            DropTable("dbo.UserResourcePoolIndexValue");
        }
        
        public override void Down()
        {
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
                        User_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserOrganization",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        OrganizationId = c.Int(nullable: false),
                        NumberOfSales = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
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
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Organization",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 100),
                        SalesPrice = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
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
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.UserResourcePoolIndexValue", "User_Id");
            CreateIndex("dbo.UserResourcePoolIndexValue", new[] { "UserResourcePoolIndexId", "OrganizationId" }, unique: true, name: "IX_UserResourcePoolIndexIdOrganizationId");
            CreateIndex("dbo.UserOrganization", new[] { "UserId", "OrganizationId" }, unique: true, name: "IX_UserIdOrganizationId");
            CreateIndex("dbo.UserElementItem", new[] { "UserId", "ElementItemId" }, unique: true, name: "IX_UserIdElementItemId");
            CreateIndex("dbo.Organization", "ResourcePoolId");
            CreateIndex("dbo.OrganizationElementItem", new[] { "OrganizationId", "ElementItemId" }, unique: true, name: "IX_OrganizationIdElementItemId");
            AddForeignKey("dbo.UserResourcePoolIndexValue", "User_Id", "dbo.User", "Id");
            AddForeignKey("dbo.UserResourcePoolIndexValue", "UserResourcePoolIndexId", "dbo.UserResourcePoolIndex", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserResourcePoolIndexValue", "OrganizationId", "dbo.Organization", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserOrganization", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserOrganization", "OrganizationId", "dbo.Organization", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserElementItem", "UserId", "dbo.User", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserElementItem", "ElementItemId", "dbo.ElementItem", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
            AddForeignKey("dbo.OrganizationElementItem", "OrganizationId", "dbo.Organization", "Id", cascadeDelete: true);
            AddForeignKey("dbo.OrganizationElementItem", "ElementItemId", "dbo.ElementItem", "Id", cascadeDelete: true);
        }
    }
}
