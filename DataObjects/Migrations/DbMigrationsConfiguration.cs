namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Framework;
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
            // Data per migration
            foreach (var migration in pendingMigrations)
            {
                // Get the version number
                var migrationVersion = migration.Substring(migration.IndexOf("_") + 1);

                switch (migrationVersion)
                {
                    case "V_0_80_0":
                        {
                            Apply_V_0_80_0_Updates(context); // Initial data
                            break;
                        }
                }
            }
        }

        static void CreateAdminUser(WealthEconomyContext context)
        {
            // Manager & store
            var userStore = new UserStore(context);
            var userManager = new UserManager<User, int>(userStore);

            // Admin user
            var adminUserName = "admin";
            var adminEmail = "admin.wealth@forcrowd.org";
            var adminUser = new User(adminUserName, adminEmail)
            {
                EmailConfirmed = true,
                EmailConfirmationSentOn = DateTime.UtcNow,
                HasPassword = true
            };
            var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(adminUser, adminUserPassword);
            context.SaveChanges();

            // Add to "admin" role
            userManager.AddToRole(adminUser.Id, "Administrator");
            context.SaveChanges();
        }

        static void CreateRoles(WealthEconomyContext context)
        {
            // Manager & store
            var roleStore = new RoleStore(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            // Guest role
            var guestRole = new Role("Guest");
            roleManager.Create(guestRole);

            // Regular role
            var regularRole = new Role("Regular");
            roleManager.Create(regularRole);

            // Admin role
            var adminRole = new Role("Administrator");
            roleManager.Create(adminRole);

            // Save
            context.SaveChanges();
        }

        static void CreateSampleUser(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var userStore = new UserStore(context);
            var userManager = new UserManager<User, int>(userStore);
            var resourcePoolRepository = new ResourcePoolRepository(context);

            // Sample user
            var sampleUserName = "sample";
            var sampleEmail = "sample.wealth@forcrowd.org";
            var sampleUser = new User(sampleUserName, sampleEmail)
            {
                EmailConfirmed = true,
                EmailConfirmationSentOn = DateTime.UtcNow,
                HasPassword = true
            };
            var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(sampleUser, sampleUserPassword);
            context.SaveChanges();

            // Add to regular role
            userManager.AddToRole(sampleUser.Id, "Regular");
            context.SaveChanges();

            // Login as (required in order to save the rest of the items)
            Security.LoginAs(sampleUser.Id, "Regular");

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

            // First save
            context.SaveChanges();
        }

        static void Apply_V_0_80_0_Updates(WealthEconomyContext context)
        {
            // Create roles
            CreateRoles(context);

            // Create admin user
            CreateAdminUser(context);

            // Create sample user
            CreateSampleUser(context);
        }
    }
}
