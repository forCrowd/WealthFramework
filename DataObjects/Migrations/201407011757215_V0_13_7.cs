namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_13_7 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.UserResourcePool", "SectorIndexRating");
            DropColumn("dbo.UserResourcePool", "KnowledgeIndexRating");
            DropColumn("dbo.UserResourcePool", "TotalCostIndexRating");
        }
        
        public override void Down()
        {
            AddColumn("dbo.UserResourcePool", "TotalCostIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserResourcePool", "KnowledgeIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserResourcePool", "SectorIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
