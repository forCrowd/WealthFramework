namespace DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using System.Linq;

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
            // Create admin user
            CreateAdminUser(context);

            // Create sample user
            CreateSampleUser(context);
        }

        static void CreateAdminUser(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var roleStore = new RoleStore(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            var userStore = new UserStore(context);
            userStore.AutoSaveChanges = true;
            var userManager = new UserManager<User, int>(userStore);

            // Admin role
            var adminRoleName = "Administrator";
            var adminRole = roleManager.FindByName(adminRoleName);
            if (adminRole == null)
            {
                adminRole = new Role(adminRoleName);
                roleManager.Create(adminRole);
            }

            // Admin user
            var adminUserName = "admin@forcrowd.org";
            var adminUser = userManager.FindByName(adminUserName);
            if (adminUser == null)
            {
                adminUser = new User(adminUserName);
                var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
                userManager.Create(adminUser, adminUserPassword);
                userManager.AddToRole(adminUser.Id, "Administrator");
            }

            // Save
            context.SaveChanges();
        }

        static void CreateSampleUser(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var userStore = new UserStore(context);
            userStore.AutoSaveChanges = true;
            var userManager = new UserManager<User, int>(userStore);
            var resourcePoolRepository = new ResourcePoolRepository(context);

            // Sample user
            var sampleUserName = "sample@forcrowd.org";
            var sampleUser = userManager.FindByName(sampleUserName);
            if (sampleUser == null)
            {
                sampleUser = new User(sampleUserName);
                var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
                userManager.Create(sampleUser, sampleUserPassword);
            }

            // Save
            context.SaveChanges();

            // Login as (required in order to save the rest of the items)
            Framework.Security.LoginAs(sampleUser.Id);

            // Sample resource pools
            var upoSample = resourcePoolRepository.CreateUPOSample(sampleUser);
            var basicsExistingSystemSample = resourcePoolRepository.CreateBasicsExistingSystemSample(sampleUser);
            var basicsNewSystemSample = resourcePoolRepository.CreateBasicsNewSystemSample(sampleUser);
            var sectorIndexSample = resourcePoolRepository.CreateSectorIndexSample(sampleUser);
            var knowledgeIndexSample = resourcePoolRepository.CreateKnowledgeIndexSample(sampleUser);
            var knowledgeIndexPopularSoftwareLicenseSample = resourcePoolRepository.CreateKnowledgeIndexPopularSoftwareLicenseSample(sampleUser);
            var totalCostIndexExistingSystemSample = resourcePoolRepository.CreateTotalCostIndexExistingSystemSample(sampleUser);
            var totalCostIndexNewSystemSample = resourcePoolRepository.CreateTotalCostIndexNewSystemSample(sampleUser);
            var totalCostIndexNewSystemAftermathSample = resourcePoolRepository.CreateTotalCostIndexNewSystemAftermathSample(sampleUser);
            var fairShareSample = resourcePoolRepository.CreateFairShareSample(sampleUser);
            var indexesPieSample = resourcePoolRepository.CreateIndexesPieSample(sampleUser);
            var resourcePoolRateSample = resourcePoolRepository.CreateResourcePoolRateSample(sampleUser);
            //var allInOneSample = resourcePoolRepository.CreateAllInOneSample(sampleUser);
            
            resourcePoolRepository.Insert(upoSample);
            resourcePoolRepository.Insert(basicsExistingSystemSample);
            resourcePoolRepository.Insert(basicsNewSystemSample);
            resourcePoolRepository.Insert(sectorIndexSample);
            resourcePoolRepository.Insert(knowledgeIndexSample);
            resourcePoolRepository.Insert(knowledgeIndexPopularSoftwareLicenseSample);
            resourcePoolRepository.Insert(totalCostIndexExistingSystemSample);
            resourcePoolRepository.Insert(totalCostIndexNewSystemSample);
            resourcePoolRepository.Insert(totalCostIndexNewSystemAftermathSample);
            resourcePoolRepository.Insert(fairShareSample);
            resourcePoolRepository.Insert(indexesPieSample);
            resourcePoolRepository.Insert(resourcePoolRateSample);
            //resourcePoolRepository.Insert(allInOneSample);

            // First save
            context.SaveChanges();

            // Set main elements
            upoSample.SetMainElement();
            basicsExistingSystemSample.SetMainElement();
            basicsNewSystemSample.SetMainElement();
            sectorIndexSample.SetMainElement();
            knowledgeIndexSample.SetMainElement();
            knowledgeIndexPopularSoftwareLicenseSample.SetMainElement();
            totalCostIndexExistingSystemSample.SetMainElement();
            totalCostIndexNewSystemSample.SetMainElement();
            totalCostIndexNewSystemAftermathSample.SetMainElement();
            fairShareSample.SetMainElement();
            indexesPieSample.SetMainElement();
            resourcePoolRateSample.SetMainElement();

            // Second save for main elements
            context.SaveChanges();
        }
    }
}
