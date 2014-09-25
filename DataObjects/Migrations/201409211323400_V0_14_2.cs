namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_2 : DbMigration
    {
        public override void Up()
        {
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
                "dbo.ElementItemElementField",
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
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementField", t => t.ElementFieldId, cascadeDelete: false)
                .ForeignKey("dbo.ElementItem", t => t.ElementItemId, cascadeDelete: true)
                .Index(t => new { t.ElementItemId, t.ElementFieldId }, unique: true, name: "IX_ElementItemIdElementFieldId");
            
            CreateTable(
                "dbo.UserElementItemElementField",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ElementItemElementFieldId = c.Int(nullable: false),
                        Rating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        DeletedOn = c.DateTime(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ElementItemElementField", t => t.ElementItemElementFieldId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: false)
                .Index(t => new { t.UserId, t.ElementItemElementFieldId }, unique: true, name: "IX_UserIdElementItemElementFieldId");
            
            AddColumn("dbo.ResourcePoolIndex", "ElementFieldId", c => c.Int());
            CreateIndex("dbo.ResourcePoolIndex", "ElementFieldId");
            AddForeignKey("dbo.ResourcePoolIndex", "ElementFieldId", "dbo.ElementField", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserElementItemElementField", "UserId", "dbo.User");
            DropForeignKey("dbo.UserElementItemElementField", "ElementItemElementFieldId", "dbo.ElementItemElementField");
            DropForeignKey("dbo.ResourcePoolIndex", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ElementItemElementField", "ElementItemId", "dbo.ElementItem");
            DropForeignKey("dbo.ElementItemElementField", "ElementFieldId", "dbo.ElementField");
            DropForeignKey("dbo.ElementField", "ElementId", "dbo.Element");
            DropIndex("dbo.UserElementItemElementField", "IX_UserIdElementItemElementFieldId");
            DropIndex("dbo.ResourcePoolIndex", new[] { "ElementFieldId" });
            DropIndex("dbo.ElementItemElementField", "IX_ElementItemIdElementFieldId");
            DropIndex("dbo.ElementField", new[] { "ElementId" });
            DropColumn("dbo.ResourcePoolIndex", "ElementFieldId");
            DropTable("dbo.UserElementItemElementField");
            DropTable("dbo.ElementItemElementField");
            DropTable("dbo.ElementField");
        }
    }
}
