namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_11_9 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.User", "AspNetUserId", c => c.String(nullable: false, maxLength: 256));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.User", "AspNetUserId", c => c.String(maxLength: 256));
        }
    }
}
