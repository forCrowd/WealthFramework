using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects
{
    using BusinessObjects;
    using Migrations;
    using System.Data.Entity;

    internal class MigrateDatabaseToLatestVersion : MigrateDatabaseToLatestVersion<WealthEconomyContext, DbMigrationsConfiguration>
    {
        public bool IsTest { get; private set; }

        public MigrateDatabaseToLatestVersion(bool isTest = false)
        {
            IsTest = isTest;
        }

        public override void InitializeDatabase(WealthEconomyContext context)
        {
            // If it's test, drop it first
            if (IsTest && context.Database.Exists())
                context.Database.Delete();

            base.InitializeDatabase(context);
        }
    }
}
