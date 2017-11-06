namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class V_0_82_0 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool");
            DropForeignKey("dbo.UserResourcePool", "UserId", "dbo.User");
            DropIndex("dbo.UserResourcePool", new[] { "UserId" });
            DropIndex("dbo.UserResourcePool", new[] { "ResourcePoolId" });
            AlterColumn("dbo.ElementField", "UseFixedValue", c => c.Boolean(nullable: false));
            DropColumn("dbo.ElementField", "IndexCalculationType");
            DropColumn("dbo.ElementField", "IndexSortType");
            DropColumn("dbo.UserElementCell", "BooleanValue");
            DropColumn("dbo.UserElementCell", "IntegerValue");
            DropColumn("dbo.UserElementCell", "DateTimeValue");
            DropColumn("dbo.ResourcePool", "UseFixedResourcePoolRate");
            DropColumn("dbo.ResourcePool", "ResourcePoolRateTotal");
            DropColumn("dbo.ResourcePool", "ResourcePoolRateCount");
            DropTable("dbo.UserResourcePool",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "UserAnnotation", "UserId" },
                });
        }
        
        public override void Down()
        {
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
                .PrimaryKey(t => new { t.UserId, t.ResourcePoolId });
            
            AddColumn("dbo.ResourcePool", "ResourcePoolRateCount", c => c.Int(nullable: false));
            AddColumn("dbo.ResourcePool", "ResourcePoolRateTotal", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.ResourcePool", "UseFixedResourcePoolRate", c => c.Boolean(nullable: false));
            AddColumn("dbo.UserElementCell", "DateTimeValue", c => c.DateTime());
            AddColumn("dbo.UserElementCell", "IntegerValue", c => c.Int());
            AddColumn("dbo.UserElementCell", "BooleanValue", c => c.Boolean());
            AddColumn("dbo.ElementField", "IndexSortType", c => c.Byte(nullable: false));
            AddColumn("dbo.ElementField", "IndexCalculationType", c => c.Byte(nullable: false));
            AlterColumn("dbo.ElementField", "UseFixedValue", c => c.Boolean());
            CreateIndex("dbo.UserResourcePool", "ResourcePoolId");
            CreateIndex("dbo.UserResourcePool", "UserId");
            AddForeignKey("dbo.UserResourcePool", "UserId", "dbo.User", "Id");
            AddForeignKey("dbo.UserResourcePool", "ResourcePoolId", "dbo.ResourcePool", "Id", cascadeDelete: true);
        }
    }
}
