namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.DataObjects;
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
            // Data per migration
            foreach (var migration in pendingMigrations)
            {
                // Get the version number
                var migrationVersion = migration.Substring(migration.IndexOf("_") + 1);

                switch (migrationVersion)
                {
                    case "Initial":
                        {
                            // Initial data
                            SeedInitialData(context);
                            break;
                        }
                }
            }
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
            forCrowd.WealthEconomy.Framework.Security.LoginAs(sampleUser.Id);

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
            var allInOneSample = resourcePoolRepository.CreateAllInOneSample(sampleUser);

            var billionDollarQuestion = resourcePoolRepository.CreateBillionDollarQuestion(sampleUser);

            // Set Id fields explicitly, since strangely EF doesn't save them in the order that they've been added to ResourcePoolSet.
            // And they're referred with these Ids on front-end samples
            upoSample.Id = 1;
            basicsExistingSystemSample.Id = 2;
            basicsNewSystemSample.Id = 3;
            sectorIndexSample.Id = 4;
            knowledgeIndexSample.Id = 5;
            knowledgeIndexPopularSoftwareLicenseSample.Id = 6;
            totalCostIndexExistingSystemSample.Id = 7;
            totalCostIndexNewSystemSample.Id = 8;
            totalCostIndexNewSystemAftermathSample.Id = 9;
            fairShareSample.Id = 10;
            indexesPieSample.Id = 11;
            resourcePoolRateSample.Id = 12;
            allInOneSample.Id = 13;

            billionDollarQuestion.Id = 14;
            
            // Insert
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
            resourcePoolRepository.Insert(allInOneSample);

            resourcePoolRepository.Insert(billionDollarQuestion);

            // First save
            context.SaveChanges();

            // Set main elements; ResourcePool has both child elements and a main element navigation property
            // If main element will be set on initially, it would try to create a resource pool with an element and that's not been inserted to database, which fails.
            // So, creating resource pools & elements and main element selections are done separately.
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
            allInOneSample.SetMainElement();

            billionDollarQuestion.SetMainElement();

            // Second save for main elements
            context.SaveChanges();
        }
    }
}
