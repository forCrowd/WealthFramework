namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    
    public partial class V_0_80_0 : DbMigration
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
                        DataType = c.Byte(nullable: false),
                        SelectedElementId = c.Int(),
                        UseFixedValue = c.Boolean(),
                        IndexEnabled = c.Boolean(nullable: false),
                        IndexCalculationType = c.Byte(nullable: false),
                        IndexSortType = c.Byte(nullable: false),
                        SortOrder = c.Byte(nullable: false),
                        IndexRatingTotal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        IndexRatingCount = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Element", t => t.ElementId, cascadeDelete: true)
                .ForeignKey("dbo.Element", t => t.SelectedElementId)
                .Index(t => t.ElementId)
                .Index(t => t.SelectedElementId);
            
            CreateTable(
                "dbo.ElementCell",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementFieldId = c.Int(nullable: false),
                        ElementItemId = c.Int(nullable: false),
                        StringValue = c.String(),
                        NumericValueTotal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        NumericValueCount = c.Int(nullable: false),
                        SelectedElementItemId = c.Int(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .ForeignKey("dbo.ElementItem", t => t.SelectedElementItemId)
                .Index(t => new { t.ElementFieldId, t.ElementItemId }, unique: true, name: "UX_ElementCell_ElementFieldId_ElementItemId")
                .Index(t => t.SelectedElementItemId);
            
            CreateTable(
                "dbo.ElementItem",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ElementId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 150),
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
                        UserId = c.Int(nullable: false),
                        ElementCellId = c.Int(nullable: false),
                        BooleanValue = c.Boolean(),
                        IntegerValue = c.Int(),
                        DecimalValue = c.Decimal(precision: 18, scale: 2),
                        DateTimeValue = c.DateTime(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                })
                .PrimaryKey(t => new { t.UserId, t.ElementCellId })
                .ForeignKey("dbo.ElementCell", t => t.ElementCellId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.ElementCellId);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EmailConfirmationSentOn = c.DateTime(),
                        HasPassword = c.Boolean(nullable: false),
                        SingleUseToken = c.String(),
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
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                        UserId = c.Int(nullable: false),
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
                        UserId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.ResourcePool",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        Key = c.String(nullable: false, maxLength: 250),
                        Name = c.String(nullable: false, maxLength: 50),
                        Description = c.String(),
                        InitialValue = c.Decimal(nullable: false, precision: 18, scale: 2),
                        UseFixedResourcePoolRate = c.Boolean(nullable: false),
                        ResourcePoolRateTotal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        ResourcePoolRateCount = c.Int(nullable: false),
                        RatingCount = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.UserId, t.Key }, unique: true, name: "UX_ResourcePool_UserId_Key");
            
            CreateTable(
                "dbo.UserResourcePool",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        ResourcePoolId = c.Int(nullable: false),
                        ResourcePoolRate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                })
                .PrimaryKey(t => new { t.UserId, t.ResourcePoolId })
                .ForeignKey("dbo.ResourcePool", t => t.ResourcePoolId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.ResourcePoolId);
            
            CreateTable(
                "dbo.UserRole",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        RoleId = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.Role", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.UserElementField",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        ElementFieldId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                })
                .PrimaryKey(t => new { t.UserId, t.ElementFieldId })
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.ElementFieldId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ElementField", "SelectedElementId", "dbo.Element");
            DropForeignKey("dbo.UserElementCell", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementField", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementField", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.UserRole", "UserId", "dbo.User");
            DropForeignKey("dbo.UserRole", "RoleId", "dbo.Role");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.ResourcePool", "UserId", "dbo.User");
            DropForeignKey("dbo.Element", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserLogin", "UserId", "dbo.User");
            DropForeignKey("dbo.UserClaim", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementCell", "ElementCellId", "dbo.ElementCell");
            DropForeignKey("dbo.ElementCell", "SelectedElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementCell", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItem", "ElementId", "dbo.Element");
            DropForeignKey("dbo.ElementCell", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ElementField", "ElementId", "dbo.Element");
            DropIndex("dbo.UserElementField", new[] { "ElementFieldId" });
            DropIndex("dbo.UserElementField", new[] { "UserId" });
            DropIndex("dbo.Role", "RoleNameIndex");
            DropIndex("dbo.UserRole", new[] { "RoleId" });
            DropIndex("dbo.UserRole", new[] { "UserId" });
            DropIndex("dbo.UserResourcePool", new[] { "ResourcePoolId" });
            DropIndex("dbo.UserResourcePool", new[] { "UserId" });
            DropIndex("dbo.ResourcePool", "UX_ResourcePool_UserId_Key");
            DropIndex("dbo.UserLogin", new[] { "UserId" });
            DropIndex("dbo.UserClaim", new[] { "UserId" });
            DropIndex("dbo.User", "UserNameIndex");
            DropIndex("dbo.UserElementCell", new[] { "ElementCellId" });
            DropIndex("dbo.UserElementCell", new[] { "UserId" });
            DropIndex("dbo.ElementItem", new[] { "ElementId" });
            DropIndex("dbo.ElementCell", new[] { "SelectedElementItemId" });
            DropIndex("dbo.ElementCell", "UX_ElementCell_ElementFieldId_ElementItemId");
            DropIndex("dbo.ElementField", new[] { "SelectedElementId" });
            DropIndex("dbo.ElementField", new[] { "ElementId" });
            DropIndex("dbo.Element", new[] { "ResourcePoolId" });
            DropTable("dbo.UserElementField",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                });
            DropTable("dbo.Role");
            DropTable("dbo.UserRole");
            DropTable("dbo.UserResourcePool",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                });
            DropTable("dbo.ResourcePool");
            DropTable("dbo.UserLogin");
            DropTable("dbo.UserClaim");
            DropTable("dbo.User");
            DropTable("dbo.UserElementCell",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                });
            DropTable("dbo.ElementItem");
            DropTable("dbo.ElementCell");
            DropTable("dbo.ElementField");
            DropTable("dbo.Element");
        }
    }
}
