namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_7_3 : DbMigration
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
                        IsMainElement = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: true)
                .Index(t => t.ResourcePoolId);
            
            CreateTable(
                "dbo.ElementField",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        ElementFieldType = c.Byte(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .Index(t => t.ElementId);
            
            CreateTable(
                "dbo.ElementCell",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementItemId = c.Int(nullable: false),
                        ElementFieldId = c.Int(nullable: false),
                        StringValue = c.String(),
                        BooleanValue = c.Boolean(),
                        IntegerValue = c.Int(),
                        DecimalValue = c.Decimal(precision: 18, scale: 2),
                        DateTimeValue = c.DateTime(),
                        SelectedElementItemId = c.Int(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId, cascadeDelete: true)
                .ForeignKey("dbo.ElementItem", t => t.SelectedElementItemId)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: false)
                .Index(t => new { t.ElementItemId, t.ElementFieldId }, unique: true, name: "IX_ElementCellId")
                .Index(t => t.SelectedElementItemId);
            
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
                "dbo.UserElementCell",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        ElementCellId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementCell", t => t.ElementCellId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => new { t.UserId, t.ElementCellId }, unique: true, name: "IX_UserIdElementCellId");
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(maxLength: 50),
                        MiddleName = c.String(maxLength: 50),
                        LastName = c.String(maxLength: 50),
                        Notes = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.UserClaim",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserLogin",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserRole",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Role", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.UserResourcePool",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        ResourcePoolId = c.Int(nullable: false),
                        ResourcePoolRate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => new { t.UserId, t.ResourcePoolId }, unique: true, name: "IX_UserIdResourcePoolId");
            
            CreateTable(
                "dbo.ResourcePool",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                        IsSample = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ResourcePoolIndex",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResourcePoolId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        ElementId = c.Int(),
                        ElementFieldId = c.Int(),
                        RatingSortType = c.Byte(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId)
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId)
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: true)
                .Index(t => t.ResourcePoolId)
                .Index(t => t.ElementId)
                .Index(t => t.ElementFieldId);
            
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
                .ForeignKey("dbo.ResourcePoolIndex", t => t.ResourcePoolIndexId, cascadeDelete: true)
                .ForeignKey("dbo.UserResourcePool", t => t.UserResourcePoolId, cascadeDelete: false)
                .Index(t => new { t.UserResourcePoolId, t.ResourcePoolIndexId }, unique: true, name: "IX_UserResourcePoolIdResourcePoolIndexId");
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRole", "RoleId", "dbo.Role");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserResourcePoolIndex", "UserResourcePoolId", "dbo.UserResourcePool");
            DropForeignKey("dbo.UserResourcePoolIndex", "ResourcePoolIndexId", "dbo.ResourcePoolIndex");
            DropForeignKey("dbo.ResourcePoolIndex", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementId", "dbo.Element");
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserElementCell", "UserId", "dbo.User");
            DropForeignKey("dbo.UserRole", "UserId", "dbo.User");
            DropForeignKey("dbo.UserLogin", "UserId", "dbo.User");
            DropForeignKey("dbo.UserClaim", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementCell", "ElementCellId", "dbo.ElementCell");
            DropForeignKey("dbo.ElementCell", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementCell", "SelectedElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropForeignKey("dbo.ElementCell", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ElementField", "ElementId", "dbo.Element");
            DropIndex("dbo.Role", "RoleNameIndex");
            DropIndex("dbo.UserResourcePoolIndex", "IX_UserResourcePoolIdResourcePoolIndexId");
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementFieldId" });
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementId" });
            DropIndex("dbo.ResourcePoolIndex", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserResourcePool", "IX_UserIdResourcePoolId");
            DropIndex("dbo.UserRole", new[] { "RoleId" });
            DropIndex("dbo.UserRole", new[] { "UserId" });
            DropIndex("dbo.UserLogin", new[] { "UserId" });
            DropIndex("dbo.UserClaim", new[] { "UserId" });
            DropIndex("dbo.User", "UserNameIndex");
            DropIndex("dbo.UserElementCell", "IX_UserIdElementCellId");
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.ElementCell", new[] { "SelectedElementItemId" });
            DropIndex("dbo.ElementCell", "IX_ElementCellId");
            DropIndex("dbo.ElementField", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropTable("dbo.Role");
            DropTable("dbo.UserResourcePoolIndex");
            DropTable("dbo.ResourcePoolIndex");
            DropTable("dbo.ResourcePool");
            DropTable("dbo.UserResourcePool");
            DropTable("dbo.UserRole");
            DropTable("dbo.UserLogin");
            DropTable("dbo.UserClaim");
            DropTable("dbo.User");
            DropTable("dbo.UserElementCell");
            DropTable("dbo.ElementItem");
            DropTable("dbo.ElementCell");
            DropTable("dbo.ElementField");
            DropTable("dbo.Element");
        }
    }
}
