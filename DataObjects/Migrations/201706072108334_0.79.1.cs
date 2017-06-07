namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _0791 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.User", "HasPassword", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.User", "HasPassword", c => c.Boolean());
        }
    }
}
