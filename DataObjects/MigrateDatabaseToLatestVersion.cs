namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Migrations;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;

    internal class MigrateDatabaseToLatestVersion : MigrateDatabaseToLatestVersion<WealthEconomyContext, DbMigrationsConfiguration>
    {
        public bool IsTest { get; private set; }

        public MigrateDatabaseToLatestVersion(bool isTest = false)
            : base()
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
