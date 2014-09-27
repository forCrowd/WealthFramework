namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_14_3 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Organization", "ProductionCost");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Organization", "ProductionCost", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
