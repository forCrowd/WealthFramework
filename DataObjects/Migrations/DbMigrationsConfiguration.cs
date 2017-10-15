namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
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

        #region Users - Roles

        static void CreateAdminUser(WealthEconomyContext context)
        {
            // Manager & store
            var userStore = new AppUserStore(context);
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
            var roleStore = new RoleStore<Role, int, UserRole>(context);
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
            var userStore = new AppUserStore(context);
            var userManager = new UserManager<User, int>(userStore);
            var resourcePoolRepository = context.Set<ResourcePool>();

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
            var billionDollarQuestion = CreateBillionDollarQuestion(sampleUser);
            var upoSample = CreateUPOSample(sampleUser);
            var basicsExistingSystemSample = CreateBasicsExistingSystemSample(sampleUser);
            var basicsNewSystemSample = CreateBasicsNewSystemSample(sampleUser);
            var priorityIndexSample = CreatePriorityIndexSample(sampleUser);
            var knowledgeIndexSample = CreateKnowledgeIndexSample(sampleUser);
            var knowledgeIndexPopularSoftwareLicenseSample = CreateKnowledgeIndexPopularSoftwareLicenseSample(sampleUser);
            var totalCostIndexExistingSystemSample = CreateTotalCostIndexExistingSystemSample(sampleUser);
            var totalCostIndexNewSystemSample = CreateTotalCostIndexNewSystemSample(sampleUser);
            var allInOneSample = CreateAllInOneSample(sampleUser);

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
            resourcePoolRepository.Add(billionDollarQuestion);
            resourcePoolRepository.Add(upoSample);
            resourcePoolRepository.Add(basicsExistingSystemSample);
            resourcePoolRepository.Add(basicsNewSystemSample);
            resourcePoolRepository.Add(priorityIndexSample);
            resourcePoolRepository.Add(knowledgeIndexSample);
            resourcePoolRepository.Add(knowledgeIndexPopularSoftwareLicenseSample);
            resourcePoolRepository.Add(totalCostIndexExistingSystemSample);
            resourcePoolRepository.Add(totalCostIndexNewSystemSample);
            resourcePoolRepository.Add(allInOneSample);

            // First save
            context.SaveChanges();
        }

        #endregion

        #region ResourcePools

        static ResourcePool CreateBillionDollarQuestion(User user)
        {
            const int numberOfItems = 5;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Billion Dollar Question",
                useFixedResourcePoolRate: true,
                mainElementName: "Issues",
                addDirectIncomeField: false,
                addMultiplierField: false,
                addImportanceIndex: true,
                numberOfItems: numberOfItems);
            resourcePool.InitialValue = 1000000000;
            resourcePool.RatingCount = 1; // Computed field

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Rating";
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).IndexCalculationType = (byte)ElementFieldIndexCalculationType.Passive;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics: Curing baldness";
            mainElement.ElementItemSet.Skip(1).First().Name = "Education: Reducing illiteracy";
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment: Enhancing video games";
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare: Curing cancer";
            mainElement.ElementItemSet.Skip(4).First().Name = "Poverty: Clean water for everyone";

            // Return
            return resourcePool;
        }

        static ResourcePool CreateUPOSample(User user)
        {
            const int numberOfItems = 1;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Unidentified Profiting Object (UPO)",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Unidentified Profiting Object";

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.First().Name = "UPO";

            // Return
            return resourcePool;
        }

        static ResourcePool CreateBasicsExistingSystemSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - Existing Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Basics Existing Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        static ResourcePool CreateBasicsNewSystemSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - New Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: true,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Basics New Model";
            resourcePool.RatingCount = 1; // Computed field

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        static ResourcePool CreatePriorityIndexSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Priority Index Sample",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.RatingCount = 1; // Computed field

            // Industry element
            var industryElement = resourcePool.AddElement("Industry");

            // Importance field
            var importanceField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(importanceField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(importanceField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(importanceField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(importanceField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(0).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(1).First().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(1).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(2).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(3).First().AddCell(industryField).SetValue(healthcareItem);

            // Old list
            //mainElement.ElementItemSet.Skip(0).First().Name = "Basic Materials";
            //mainElement.ElementItemSet.Skip(1).First().Name = "Conglomerates";
            //mainElement.ElementItemSet.Skip(2).First().Name = "Consumer Goods";
            //mainElement.ElementItemSet.Skip(3).First().Name = "Financial";
            //mainElement.ElementItemSet.Skip(4).First().Name = "Healthcare";
            //mainElement.ElementItemSet.Skip(5).First().Name = "Industrial Goods";
            //mainElement.ElementItemSet.Skip(6).First().Name = "Services";
            //mainElement.ElementItemSet.Skip(7).First().Name = "Technology";
            //mainElement.ElementItemSet.Skip(8).First().Name = "Utilities";

            // Return
            return resourcePool;
        }

        static ResourcePool CreateKnowledgeIndexSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index Sample",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.RatingCount = 1; // Computed field

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Hidden Knowledge";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(1).First().Name = "True Source";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(2).First().Name = "Commercial Organization B";
            //mainElement.ElementItemSet.Skip(2).First().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(3).First().Name = "Open Source Organization B";
            //mainElement.ElementItemSet.Skip(3).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        static ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index - Popular Software Licenses",
                useFixedResourcePoolRate: true,
                mainElementName: "License",
                addDirectIncomeField: false,
                addMultiplierField: false,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Knowledge Index Popular Software Licenses";
            resourcePool.RatingCount = 1; // Computed field

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var importanceField = mainElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex(ElementFieldIndexCalculationType.Passive, ElementFieldIndexSortType.HighestToLowest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(1).First().Name = "EULA (Wikipedia)";
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(2).First().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(2).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(3).First().Name = "MIT";
            mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField);

            // Return
            return resourcePool;
        }

        static ResourcePool CreateTotalCostIndexExistingSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - Existing Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Product",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Total Cost Index Existing Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);

            // Return
            return resourcePool;
        }

        static ResourcePool CreateTotalCostIndexNewSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - New Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Product",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Total Cost Index New Model";
            resourcePool.RatingCount = 1; // Computed field

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);

            // Return
            return resourcePool;
        }

        static ResourcePool CreateAllInOneSample(User user)
        {
            const int numberOfItems = 16;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "All in One",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.RatingCount = 1; // Computed field

            // Industry element
            var industryElement = resourcePool.AddElement("Industry");

            // Fields
            var industryRatingField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            industryRatingField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(industryRatingField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(industryRatingField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(industryRatingField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(industryRatingField).ElementItem;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        static ResourcePool CreateDefaultResourcePool(User user, string resourcePoolName, bool useFixedResourcePoolRate, string mainElementName, bool addDirectIncomeField, bool addMultiplierField, bool addImportanceIndex, int numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(user, resourcePoolName);

            if (useFixedResourcePoolRate)
            {
                resourcePool.UseFixedResourcePoolRate = true;
                resourcePool.AddUserResourcePool(10);

                resourcePool.ResourcePoolRateTotal = 10; // Computed field
                resourcePool.ResourcePoolRateCount = 1; // Computed field
            }

            // Main element
            var element = resourcePool.AddElement(mainElementName);
            element.IsMainElement = true;

            // Resource pool field
            if (addDirectIncomeField)
                element.AddField("Direct Income", ElementFieldDataType.DirectIncome, true);

            // Multiplier field
            if (addMultiplierField)
                element.AddField("Multiplier", ElementFieldDataType.Multiplier);

            // Importance field
            ElementField importanceField = null;
            if (addImportanceIndex)
            {
                importanceField = element.AddField("Importance Field", ElementFieldDataType.Decimal, false);
                importanceField.EnableIndex();
            }

            // Items, cells, user cells
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = string.Format("Item {0}", i);

                var item = element.AddItem(itemName);

                if (addDirectIncomeField)
                    item.AddCell(element.DirectIncomeField).SetValue(100M); // Default value

                if (addMultiplierField)
                    item.AddCell(element.MultiplierField);

                if (addImportanceIndex)
                    item.AddCell(importanceField);
            }

            // Return
            return resourcePool;
        }

        #endregion

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
