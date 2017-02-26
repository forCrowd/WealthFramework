namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Framework;
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
            var adminUserName = "admin";
            var adminEmail = "admin.wealth@forcrowd.org";
            var adminUser = userManager.FindByEmail(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User(adminUserName, adminEmail);
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
            var sampleUserName = "sample";
            var sampleEmail = "sample.wealth@forcrowd.org";
            var sampleUser = userManager.FindByEmail(sampleEmail);
            if (sampleUser == null)
            {
                sampleUser = new User(sampleUserName, sampleEmail);
                var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
                userManager.Create(sampleUser, sampleUserPassword);
            }

            // Save
            context.SaveChanges();

            // Login as (required in order to save the rest of the items)
            Security.LoginAs(sampleUser.Id);

            // Sample resource pools
            var billionDollarQuestion = resourcePoolRepository.CreateBillionDollarQuestion(sampleUser);
            var upoSample = resourcePoolRepository.CreateUPOSample(sampleUser);
            var basicsExistingSystemSample = resourcePoolRepository.CreateBasicsExistingSystemSample(sampleUser);
            var basicsNewSystemSample = resourcePoolRepository.CreateBasicsNewSystemSample(sampleUser);
            var priorityIndexSample = resourcePoolRepository.CreatePriorityIndexSample(sampleUser);
            var knowledgeIndexSample = resourcePoolRepository.CreateKnowledgeIndexSample(sampleUser);
            var knowledgeIndexPopularSoftwareLicenseSample = resourcePoolRepository.CreateKnowledgeIndexPopularSoftwareLicenseSample(sampleUser);
            var totalCostIndexExistingSystemSample = resourcePoolRepository.CreateTotalCostIndexExistingSystemSample(sampleUser);
            var totalCostIndexNewSystemSample = resourcePoolRepository.CreateTotalCostIndexNewSystemSample(sampleUser);
            var allInOneSample = resourcePoolRepository.CreateAllInOneSample(sampleUser);
            var connect2effectDemo = resourcePoolRepository.CreateConnect2EffectDemo(sampleUser);

            // Set Id fields explicitly, since strangely EF doesn't save them in the order that they've been added to ResourcePoolSet.
            // And they're referred with these Ids on front-end samples
            billionDollarQuestion.Id = 1;
            upoSample.Id = 8;
            basicsExistingSystemSample.Id = 9;
            basicsNewSystemSample.Id = 10;
            priorityIndexSample.Id = 2;
            knowledgeIndexSample.Id = 3;
            knowledgeIndexPopularSoftwareLicenseSample.Id = 4;
            totalCostIndexExistingSystemSample.Id = 5;
            totalCostIndexNewSystemSample.Id = 6;
            allInOneSample.Id = 7;
            connect2effectDemo.Id = 8;

            // Insert
            resourcePoolRepository.Insert(billionDollarQuestion);
            resourcePoolRepository.Insert(upoSample);
            resourcePoolRepository.Insert(basicsExistingSystemSample);
            resourcePoolRepository.Insert(basicsNewSystemSample);
            resourcePoolRepository.Insert(priorityIndexSample);
            resourcePoolRepository.Insert(knowledgeIndexSample);
            resourcePoolRepository.Insert(knowledgeIndexPopularSoftwareLicenseSample);
            resourcePoolRepository.Insert(totalCostIndexExistingSystemSample);
            resourcePoolRepository.Insert(totalCostIndexNewSystemSample);
            resourcePoolRepository.Insert(allInOneSample);
            resourcePoolRepository.Insert(connect2effectDemo);

            // First save
            context.SaveChanges();
        }
    }
}
