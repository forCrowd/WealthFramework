namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_13_6 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ResourcePoolIndex", "ResourcePoolIndexType", c => c.Byte(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ResourcePoolIndex", "ResourcePoolIndexType");
        }
    }
}
