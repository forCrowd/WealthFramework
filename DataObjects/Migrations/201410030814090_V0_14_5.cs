namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_5 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ElementItemElementField", "SelectedElementItemId", c => c.Int());
            CreateIndex("dbo.ElementItemElementField", "SelectedElementItemId");
            AddForeignKey("dbo.ElementItemElementField", "SelectedElementItemId", "dbo.ElementItem", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ElementItemElementField", "SelectedElementItemId", "dbo.ElementItem");
            DropIndex("dbo.ElementItemElementField", new[] { "SelectedElementItemId" });
            DropColumn("dbo.ElementItemElementField", "SelectedElementItemId");
        }
    }
}
