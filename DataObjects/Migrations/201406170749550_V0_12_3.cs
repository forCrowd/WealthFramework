namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_12_3 : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.UserResourcePool", new[] { "UserId" });
            DropIndex("dbo.UserResourcePool", new[] { "ResourcePoolId" });
            CreateIndex("dbo.UserResourcePool", new[] { "UserId", "ResourcePoolId" }, unique: true, name: "IX_UserIdResourcePoolId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.UserResourcePool", "IX_UserIdResourcePoolId");
            CreateIndex("dbo.UserResourcePool", "ResourcePoolId");
            CreateIndex("dbo.UserResourcePool", "UserId");
        }
    }
}
