namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_13_1 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.UserResourcePool", "DistanceIndexRating");
        }
        
        public override void Down()
        {
            AddColumn("dbo.UserResourcePool", "DistanceIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
