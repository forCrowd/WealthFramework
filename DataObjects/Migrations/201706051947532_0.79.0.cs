namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _0790 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "EmailConfirmationSentOn", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "EmailConfirmationSentOn");
        }
    }
}
