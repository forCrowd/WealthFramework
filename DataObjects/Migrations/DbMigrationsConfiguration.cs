using System;
using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class DbMigrationsConfiguration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        private readonly IEnumerable<string> pendingMigrations;

        public DbMigrationsConfiguration()
        {
            ContextKey = "WealthEconomyContext";
            AutomaticMigrationsEnabled = false;

            // Get the migrations
            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(WealthEconomyContext context)
        {
            // Data per migration
            foreach (var migration in pendingMigrations)
            {
                // Get the version number
                var migrationVersion = migration.Substring(migration.IndexOf("_", StringComparison.Ordinal) + 1);

                switch (migrationVersion)
                {
                    case "V_0_80_0":
                        {
                            V_0_80_0_Updates.Apply(context); // Initial data
                            break;
                        }
                    case "V_0_82_0":
                        {
                            V_0_82_0_Updates.Apply(context);
                            break;
                        }
                }
            }
        }
    }
}
