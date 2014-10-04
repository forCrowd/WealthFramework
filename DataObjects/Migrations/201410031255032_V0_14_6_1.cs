namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_6_1 : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.ElementItemElementField", newName: "ElementCell");
            RenameTable(name: "dbo.UserElementItemElementField", newName: "UserElementCell");
            RenameColumn(table: "dbo.UserElementCell", name: "ElementItemElementFieldId", newName: "ElementCellId");
            RenameIndex(table: "dbo.ElementCell", name: "IX_ElementItemIdElementFieldId", newName: "IX_ElementCellId");
            RenameIndex(table: "dbo.UserElementCell", name: "IX_UserIdElementItemElementFieldId", newName: "IX_UserIdElementCellId");
            DropColumn("dbo.ResourcePoolIndex", "ResourcePoolIndexType");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ResourcePoolIndex", "ResourcePoolIndexType", c => c.Byte(nullable: false));
            RenameIndex(table: "dbo.UserElementCell", name: "IX_UserIdElementCellId", newName: "IX_UserIdElementItemElementFieldId");
            RenameIndex(table: "dbo.ElementCell", name: "IX_ElementCellId", newName: "IX_ElementItemIdElementFieldId");
            RenameColumn(table: "dbo.UserElementCell", name: "ElementCellId", newName: "ElementItemElementFieldId");
            RenameTable(name: "dbo.UserElementCell", newName: "UserElementItemElementField");
            RenameTable(name: "dbo.ElementCell", newName: "ElementItemElementField");
        }
    }
}
