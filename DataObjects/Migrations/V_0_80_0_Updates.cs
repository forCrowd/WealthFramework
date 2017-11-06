using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Linq;

    public static class V_0_80_0_Updates
    {
        public static void Apply(WealthEconomyContext context)
        {
            // Create roles
            CreateRoles(context);

            // Create admin user
            CreateAdminUser(context);

            // Create sample user
            CreateSampleUser(context);
        }

        private static void CreateAdminUser(WealthEconomyContext context)
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

        private static void CreateRoles(WealthEconomyContext context)
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

        private static void CreateSampleUser(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var userStore = new AppUserStore(context);
            var userManager = new UserManager<User, int>(userStore);
            var resourcePoolStore = context.Set<ResourcePool>();

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
            resourcePoolStore.Add(billionDollarQuestion);
            resourcePoolStore.Add(upoSample);
            resourcePoolStore.Add(basicsExistingSystemSample);
            resourcePoolStore.Add(basicsNewSystemSample);
            resourcePoolStore.Add(priorityIndexSample);
            resourcePoolStore.Add(knowledgeIndexSample);
            resourcePoolStore.Add(knowledgeIndexPopularSoftwareLicenseSample);
            resourcePoolStore.Add(totalCostIndexExistingSystemSample);
            resourcePoolStore.Add(totalCostIndexNewSystemSample);
            resourcePoolStore.Add(allInOneSample);

            // First save
            context.SaveChanges();
        }

        private static ResourcePool CreateBillionDollarQuestion(User user)
        {
            const int numberOfItems = 5;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Billion Dollar Question",
                mainElementName: "Issues",
                addImportanceIndex: true,
                numberOfItems: numberOfItems);
            resourcePool.InitialValue = 1000000000;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Rating";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics: Curing baldness";
            mainElement.ElementItemSet.Skip(1).First().Name = "Education: Reducing illiteracy";
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment: Enhancing video games";
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare: Curing cancer";
            mainElement.ElementItemSet.Skip(4).First().Name = "Poverty: Clean water for everyone";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateUPOSample(User user)
        {
            const int numberOfItems = 1;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Unidentified Profiting Object (UPO)",
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Unidentified Profiting Object";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Items, cell, user cells
            mainElement.ElementItemSet.First().Name = "UPO";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateBasicsExistingSystemSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - Existing Model",
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Basics Existing Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateBasicsNewSystemSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - New Model",
                mainElementName: "Organization",
                addImportanceIndex: true,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Basics New Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreatePriorityIndexSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Priority Index Sample",
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

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

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateKnowledgeIndexSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index Sample",
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

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
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Hidden Knowledge";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(1).First().Name = "True Source";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index - Popular Software Licenses",
                mainElementName: "License",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Knowledge Index Popular Software Licenses";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var importanceField = mainElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

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

        private static ResourcePool CreateTotalCostIndexExistingSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - Existing Model",
                mainElementName: "Product",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Total Cost Index Existing Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateTotalCostIndexNewSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - New Model",
                mainElementName: "Product",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            resourcePool.Key = "Total Cost Index New Model";

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateAllInOneSample(User user)
        {
            const int numberOfItems = 16;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "All in One",
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

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

            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        private static ResourcePool CreateDefaultResourcePool(User user, string resourcePoolName, string mainElementName, bool addImportanceIndex, int numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(user, resourcePoolName)
            {
                InitialValue = 100
            };

            // Main element
            var element = resourcePool.AddElement(mainElementName);
            element.IsMainElement = true;

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
                var itemName = $"Item {i}";

                var item = element.AddItem(itemName);

                if (addImportanceIndex)
                    item.AddCell(importanceField);
            }

            // Return
            return resourcePool;
        }
    }
}
