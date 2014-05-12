namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V0_11_2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool");
            DropIndex("dbo.Organization", new[] { "ResourcePoolId" });
            DropColumn("dbo.Organization", "ResourcePoolId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Organization", "ResourcePoolId", c => c.Int(nullable: false));
            CreateIndex("dbo.Organization", "ResourcePoolId");
            AddForeignKey("dbo.Organization", "ResourcePoolId", "dbo.ResourcePool", "Id");
        }
    }
}
