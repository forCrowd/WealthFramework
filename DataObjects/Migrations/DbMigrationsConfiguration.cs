namespace DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class DbMigrationsConfiguration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

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
            SeedInitialData(context);

            //// Data per migration
            //foreach (var migration in pendingMigrations)
            //{
            //    // Get the version number
            //    var migrationVersion = migration.Substring(migration.IndexOf("_") + 1);

            //    switch (migrationVersion)
            //    {
            //        case "V0_14_9": // Currently the initial migration
            //            {
            //                // Initial data
            //                SeedInitialData(context);
            //                break;
            //            }
            //    }
            //}
        }

        static void SeedInitialData(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var roleStore = new RoleStore(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            var userStore = new UserStore(context);
            userStore.AutoSaveChanges = true;
            var userManager = new UserManager<User, int>(userStore);

            var resourcePoolRepository = new ResourcePoolRepository(context);

            // Admin role
            var adminRoleName = "Administrator";
            var adminRole = roleManager.FindByName(adminRoleName);
            if (adminRole == null)
            {
                adminRole = new Role(adminRoleName);
                roleManager.Create(adminRole);
            }

            // Admin user
            var adminUserName = "admin";
            var adminUser = userManager.FindByName(adminUserName);
            if (adminUser == null)
            {
                adminUser = new User(adminUserName);
                var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
                userManager.Create(adminUser, adminUserPassword);
                userManager.AddToRole(adminUser.Id, "Administrator");
            }

            // Sample user
            var sampleUserName = "sample";
            var sampleUser = userManager.FindByName(sampleUserName);
            if (sampleUser == null)
            {
                sampleUser = new User(sampleUserName);
                var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
                userManager.Create(sampleUser, sampleUserPassword);
            }
            
            // Sample resource pools
            resourcePoolRepository.Insert(resourcePoolRepository.CreateUPOSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateBasicsExistingSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateBasicsNewSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateSectorIndexSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateKnowledgeIndexSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateKnowledgeIndexPopularSoftwareLicenseSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateTotalCostIndexExistingSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateTotalCostIndexNewSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateTotalCostIndexNewSystemAftermathSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateFairShareSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateIndexesPieSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateResourcePoolRateSample(sampleUser));

            // Save
            context.SaveChanges();
        }
    }
}
