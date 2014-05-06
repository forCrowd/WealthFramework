namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_10_6 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.License", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Organization", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.ResourcePool", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Sector", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.UserSectorRating", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.User", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.UserLicenseRating", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.UserOrganization", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.UserResourcePool", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserResourcePool", "RowVersion");
            DropColumn("dbo.UserOrganization", "RowVersion");
            DropColumn("dbo.UserLicenseRating", "RowVersion");
            DropColumn("dbo.User", "RowVersion");
            DropColumn("dbo.UserSectorRating", "RowVersion");
            DropColumn("dbo.Sector", "RowVersion");
            DropColumn("dbo.ResourcePool", "RowVersion");
            DropColumn("dbo.Organization", "RowVersion");
            DropColumn("dbo.License", "RowVersion");
        }
    }
}
