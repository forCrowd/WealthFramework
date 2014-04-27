namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_9_1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.License", "Name", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Organization", "Name", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.ResourcePool", "Name", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Sector", "Name", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.User", "Email", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.User", "Password", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.User", "FirstName", c => c.String(maxLength: 50));
            AlterColumn("dbo.User", "MiddleName", c => c.String(maxLength: 50));
            AlterColumn("dbo.User", "LastName", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.User", "LastName", c => c.String());
            AlterColumn("dbo.User", "MiddleName", c => c.String());
            AlterColumn("dbo.User", "FirstName", c => c.String());
            AlterColumn("dbo.User", "Password", c => c.String(nullable: false));
            AlterColumn("dbo.User", "Email", c => c.String(nullable: false));
            AlterColumn("dbo.Sector", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.ResourcePool", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.Organization", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.License", "Name", c => c.String(nullable: false));
        }
    }
}
