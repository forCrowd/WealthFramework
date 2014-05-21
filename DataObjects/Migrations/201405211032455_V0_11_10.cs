namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_11_10 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ResourcePool", "IsSample", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ResourcePool", "IsSample");
        }
    }
}
