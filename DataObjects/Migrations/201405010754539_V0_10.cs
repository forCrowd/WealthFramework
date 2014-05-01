namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_10 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "AspNetUserId", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "AspNetUserId");
        }
    }
}
