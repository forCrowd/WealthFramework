namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Element", "IsMainElement", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Element", "IsMainElement");
        }
    }
}
