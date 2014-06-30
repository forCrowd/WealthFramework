namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_13_4 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.UserResourcePool", "QualityIndexRating");
            DropColumn("dbo.UserResourcePool", "EmployeeSatisfactionIndexRating");
            DropColumn("dbo.UserResourcePool", "CustomerSatisfactionIndexRating");
            DropColumn("dbo.UserOrganization", "QualityRating");
            DropColumn("dbo.UserOrganization", "CustomerSatisfactionRating");
            DropColumn("dbo.UserOrganization", "EmployeeSatisfactionRating");
        }
        
        public override void Down()
        {
            AddColumn("dbo.UserOrganization", "EmployeeSatisfactionRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserOrganization", "CustomerSatisfactionRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserOrganization", "QualityRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserResourcePool", "CustomerSatisfactionIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserResourcePool", "EmployeeSatisfactionIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.UserResourcePool", "QualityIndexRating", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
