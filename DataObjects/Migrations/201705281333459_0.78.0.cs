namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _0780 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.User", "IsAnonymous");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "IsAnonymous", c => c.Boolean(nullable: false));
        }
    }
}
