namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_10_1 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.User", "Password");
            DropColumn("dbo.User", "UserAccountTypeId");
            Sql("INSERT INTO AspNetRoles SELECT 'b9de0841-bc40-4258-951b-c6df37777192', 'Administrator'");
            Sql("INSERT INTO AspNetUserRoles SELECT 'a351c3ab-4bac-408c-b74b-fa386e7921b0', 'b9de0841-bc40-4258-951b-c6df37777192'");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "UserAccountTypeId", c => c.Byte(nullable: false));
            AddColumn("dbo.User", "Password", c => c.String(nullable: false, maxLength: 50));
            Sql("DELETE FROM AspNetUserRoles");
            Sql("DELETE FROM AspNetRoles");
        }
    }
}
