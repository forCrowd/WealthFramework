namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolRepository
    {
        #region - Samples -

        public ResourcePool CreateUPOSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "UPO", "Organization", null, true, true, false, 1);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.EnableSubtotals = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "UPO";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsExistingSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Basics - Existing Model", "Organization", null, true, true, false, 4);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Delta";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsNewSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Basics - New Model", "Organization", 10, true, true, true, 4);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Employee Satisfaction Rating";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Delta";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateSectorIndexSample(User user)
        {
            const byte numberOfItems = 4;
            const decimal sectorRating = 50;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Sector Index Sample", "Organization", 10, true, true, false, numberOfItems);
            resourcePool.EnableResourcePoolAddition = false;

            // Sector element
            var sectorElement = resourcePool.AddElement("Sector");

            // Importance field
            var importanceField = sectorElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            importanceField
                    .AddIndex("Sector Index", RatingSortType.HighestToLowest)
                    .AddUserRating(user, 100);

            // Items, cells, user cells
            var cosmeticsItem = sectorElement.AddItem("Cosmetics").AddCell(importanceField).SetValue(sectorRating).ElementItem;
            var educationItem = sectorElement.AddItem("Education").AddCell(importanceField).SetValue(sectorRating).ElementItem;
            var entertainmentItem = sectorElement.AddItem("Entertainment").AddCell(importanceField).SetValue(sectorRating).ElementItem;
            var healthcareItem = sectorElement.AddItem("Healthcare").AddCell(importanceField).SetValue(sectorRating).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var sectorField = mainElement.AddField("Sector", ElementFieldTypes.Element);
            sectorField.SelectedElement = sectorElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);

            // Old list
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Basic Materials";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Conglomerates";
            //mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Consumer Goods";
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Financial";
            //mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "Healthcare";
            //mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Industrial Goods";
            //mainElement.ElementItemSet.Skip(6).Take(1).Single().Name = "Services";
            //mainElement.ElementItemSet.Skip(7).Take(1).Single().Name = "Technology";
            //mainElement.ElementItemSet.Skip(8).Take(1).Single().Name = "Utilities";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexSample(User user)
        {
            const byte numberOfItems = 2;
            const decimal userRating = 50;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Knowledge Index Sample", "Organization", 10, true, true, false, numberOfItems);
            resourcePool.EnableResourcePoolAddition = false;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldTypes.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldTypes.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldTypes.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldTypes.String);
            var licenseRatingField = licenseElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            licenseRatingField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, userRating);

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).SetValue(userRating).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).SetValue(userRating).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldTypes.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Commercial Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Open Source Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Commercial Organization B";
            //mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Open Source Organization B";
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative(User user)
        {
            const byte numberOfLicenses = 4;
            const decimal ratingPerLicense = 100 / numberOfLicenses;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Knowledge Index - Popular Software Licenses", "Organization", 10, true, true, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var linkField = licenseElement.AddField("Link", ElementFieldTypes.String);
            var importanceField = licenseElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            licenseElement.AddItem("Apache-2.0").AddCell(linkField)
                .SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense);

            //licenseElement.AddItem("BSD-3-Clause")
            //    .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>")
            //    .ElementItem
            //    .AddCell(importanceField).SetValue(ratingPerLicense);

            licenseElement.AddItem("GPL-3.0")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense);

            //licenseElement.AddItem("LGPL-3.0")
            //    .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>")
            //    .ElementItem
            //    .AddCell(importanceField).SetValue(ratingPerLicense);

            licenseElement.AddItem("MIT")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense);

            // TODO Check it again
            licenseElement.AddItem("Microsoft EULA")
                .AddCell(linkField).SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense);

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldTypes.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0 Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(0).Take(1).Single());
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause Organization";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(1).Take(1).Single());
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "GPL-3.0 Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(2).Take(1).Single());
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0 Organization";
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(3).Take(1).Single());
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "MIT Organization";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(4).Take(1).Single());
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Microsoft EULA Organization";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(5).Take(1).Single());

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative2(User user)
        {
            const byte numberOfLicenses = 4;
            const decimal ratingPerLicense = 100 / numberOfLicenses;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Knowledge Index - Popular Software Licenses", "License", null, false, false, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var linkField = mainElement.AddField("Link", ElementFieldTypes.String);
            var importanceField = mainElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>");
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            //mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0";
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>");
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "MIT";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Microsoft EULA";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(linkField).SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSample(User user)
        {
            const byte numberOfLicenses = 4;
            const decimal ratingPerLicense = 100 / numberOfLicenses;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Knowledge Index - Popular Software Licenses", "License", null, false, false, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var importanceField = mainElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Apache-2.0</a>");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>BSD-3-Clause</a>");
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>GPL-3.0</a>");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            //mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0";
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>LGPL-3.0</a>");
            //mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "MIT";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>MIT</a>");
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Microsoft EULA";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().NameCell.SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Microsoft EULA</a>");
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexExistingSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Total Cost Index - Existing Model", "Product", null, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "High Profit";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexNewSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Total Cost Index - New Model", "Product", 10, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "High Profit";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexNewSystemAftermathSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Total Cost Index - New Model - Aftermath", "Product", 10, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            mainElement.MultiplierField.SortOrder = 3;

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "<s>High Profit</s>";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "<s>Average Profit</s>";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexSampleOld(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Total Cost Index Sample", "Organization", 10, true, true, false, 2);
            resourcePool.EnableResourcePoolAddition = false;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            resourcePool.ElementSet.First().DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(125M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(175M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateFairShareSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Fair Share Index", "Organization", userResourcePoolRate: 10, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;

            // Fair share element
            var fairShareElement = resourcePool.AddElement("Fair Share");

            // Fields
            var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            fairShareImportanceField
                .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            decimal ratingPerItem = 100 / 2;
            var fairShareYesItem = fairShareElement.AddItem("Sharer")
                .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
                .AddCell(fairShareImportanceField).SetValue(ratingPerItem).ElementItem;

            var fairShareNoItem = fairShareElement.AddItem("Keeper")
                .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
                .AddCell(fairShareImportanceField).SetValue(ratingPerItem).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var fairShareField = mainElement.AddField("Fair Share", ElementFieldTypes.Element);
            fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Income Keeper Inc.";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(fairShareField).SetValue(fairShareNoItem);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Fair Sharer Org.";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateIndexesPieSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Indexes Pie", "Organization", userResourcePoolRate: 10, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 1);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            //fairShareImportanceField
            //    .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
            //    .AddUserRating(user, 100);

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            decimal ratingPerIndex = 100 / 4;

            // Sector Index
            var sectorField = resourcePool.ElementSet.First().AddField("Sector Rating", ElementFieldTypes.Decimal, true);
            sectorField
                .AddIndex("Sector Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, ratingPerIndex);

            // Knowledge Index
            var licenseField = resourcePool.ElementSet.First().AddField("License Rating", ElementFieldTypes.Decimal, true);
            licenseField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, ratingPerIndex);

            // Total Cost Index
            mainElement.DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, ratingPerIndex);

            // Fair Share Index
            var fairShareField = resourcePool.ElementSet.First().AddField("Fair Share Rating", ElementFieldTypes.Decimal, true);
            fairShareField
                .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, ratingPerIndex);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "One and Only";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(sectorField).SetValue(100M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(licenseField).SetValue(100M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(fairShareField).SetValue(100M);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(sectorField).SetValue(50M);
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(25M);

            // mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldTypes.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateIndexesPieSampleOld(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "Indexes Pie", "Organization", userResourcePoolRate: 10, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            //fairShareImportanceField
            //    .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
            //    .AddUserRating(user, 100);

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // 1. index
            mainElement.DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100 / 3);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // 2. index
            var importanceField1 = resourcePool.ElementSet.First().AddField("Importance Field 1", ElementFieldTypes.Decimal, false);
            importanceField1
                .AddIndex("Importance Index 1", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100 / 3);

            // 3. index
            var importanceField2 = resourcePool.ElementSet.First().AddField("Importance Field 2", ElementFieldTypes.Decimal, false);
            importanceField2
                .AddIndex("Importance Index 2", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100 / 3);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Alpha";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(200M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField1).SetValue(100M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField2).SetValue(50M);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Beta";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField1).SetValue(50M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField2).SetValue(25M);
            
            // mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldTypes.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateResourcePoolRateSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "CMRP Rate", "Organization", userResourcePoolRate: 0, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 4);
            resourcePool.EnableResourcePoolAddition = true;
            //resourcePool.EnableSubtotals = false;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            //fairShareImportanceField
            //    .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
            //    .AddUserRating(user, 100);

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // 1. index
            //mainElement.ResourcePoolField
            //    .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
            //    .AddUserRating(user, 100 / 3);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // 2. index
            var veryImportantField = resourcePool.ElementSet.First().AddField("Very Important Rating", ElementFieldTypes.Decimal, false);
            veryImportantField
                .AddIndex("Very Important Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // 3. index
            //var importanceField2 = resourcePool.ElementSet.First().AddField("Importance Field 2", ElementFieldTypes.Decimal, false);
            //importanceField2
            //    .AddIndex("Importance Index 2", RatingSortType.HighestToLowest)
            //    .AddUserRating(user, 100 / 3);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Alpha";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(veryImportantField).SetValue(50M);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Beta";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(veryImportantField).SetValue(50M);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Charlie";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(veryImportantField).SetValue(50M);

            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Delta";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(veryImportantField).SetValue(50M);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField2).SetValue(25M);

            // mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldTypes.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateAllInOneSample(User user)
        {
            const byte numberOfItems = 8;
            const decimal userRating = 50;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, "All in One", "Organization", userResourcePoolRate: 0, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: numberOfItems);
            resourcePool.EnableResourcePoolAddition = true;
            //resourcePool.EnableSubtotals = false;

            // Sector element
            var sectorElement = resourcePool.AddElement("Sector");

            // Fields
            var sectorRatingField = sectorElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            sectorRatingField
                    .AddIndex("Sector Index", RatingSortType.HighestToLowest)
                    .AddUserRating(user, userRating);

            // Items, cells, user cells
            var cosmeticsItem = sectorElement.AddItem("Cosmetics").AddCell(sectorRatingField).SetValue(userRating).ElementItem;
            //var educationItem = sectorElement.AddItem("Education").AddCell(sectorRatingField).SetValue(userRating, user).ElementItem;
            //var entertainmentItem = sectorElement.AddItem("Entertainment").AddCell(sectorRatingField).SetValue(userRating, user).ElementItem;
            //var healthcareItem = sectorElement.AddItem("Healthcare").AddCell(sectorRatingField).SetValue(userRating, user).ElementItem;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldTypes.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldTypes.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldTypes.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldTypes.String);
            var licenseRatingField = licenseElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            licenseRatingField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, userRating);

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).SetValue(userRating).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).SetValue(userRating).ElementItem;

            // Fair share element
            var fairShareElement = resourcePool.AddElement("Fair Share");

            // Fields
            var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            var fairShareRatingField = fairShareElement.AddField("Rating", ElementFieldTypes.Decimal, false);
            fairShareRatingField
                .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, userRating);

            // Items, cell, user cells
            var keeperItem = fairShareElement.AddItem("Keeper")
                .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
                .AddCell(fairShareRatingField).SetValue(userRating).ElementItem;

            var sharerItem = fairShareElement.AddItem("Sharer")
                .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
                .AddCell(fairShareRatingField).SetValue(userRating).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            
            var sectorField = mainElement.AddField("Sector", ElementFieldTypes.Element);
            sectorField.SelectedElement = sectorElement;
            
            var licenseField = mainElement.AddField("License", ElementFieldTypes.Element);
            licenseField.SelectedElement = licenseElement;
            
            var fairShareField = mainElement.AddField("Fair Share", ElementFieldTypes.Element);
            fairShareField.SelectedElement = fairShareElement;
            
            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, userRating);

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Cosmetics (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Cosmetics (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Cosmetics (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Cosmetics (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Cosmetics (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Cosmetics (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Cosmetics (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Cosmetics (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 8;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Education (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 9;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Education (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 10;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Education (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 11;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Education (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 12;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Education (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 13;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Education (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 14;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Education (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 15;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Education (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(educationItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 16;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Entertainment (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 17;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Entertainment (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 18;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Entertainment (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 19;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Entertainment (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 20;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Entertainment (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 21;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Entertainment (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 22;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Entertainment (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 23;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Entertainment (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(entertainmentItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 24;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Healthcare (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 25;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Healthcare (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 26;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Healthcare (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 27;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "Hidden Healthcare (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 28;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Healthcare (Profit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 29;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Healthcare (Nonprofit & Keeper)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(keeperItem);

            //itemIndex = 30;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Healthcare (Profit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(110M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            //itemIndex = 31;
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().Name = "True Healthcare (Nonprofit & Sharer)";
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().ResourcePoolCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(sectorField).SetValue(healthcareItem);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(itemIndex).Take(1).Single().AddCell(fairShareField).SetValue(sharerItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateDefaultResourcePool(User user, string resourcePoolName, string mainElementName, decimal? userResourcePoolRate, bool addResourcePoolField, bool addMultiplierField, bool addImportanceIndex, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(user, resourcePoolName);

            // User resource pool
            if (userResourcePoolRate.HasValue)
                resourcePool.AddUserResourcePool(user, userResourcePoolRate.Value);

            var element = resourcePool.AddElement(mainElementName);

            // Resource pool field
            if (addResourcePoolField)
                element.AddField("Resource Pool Field", ElementFieldTypes.DirectIncome, true);

            // Multiplier field
            if (addMultiplierField)
                element.AddField("Multiplier", ElementFieldTypes.Multiplier);

            // Importance field
            ElementField importanceField = null;
            if (addImportanceIndex)
            {
                importanceField = element.AddField("Importance Field", ElementFieldTypes.Decimal, false);
                importanceField
                    .AddIndex("Importance Index", RatingSortType.HighestToLowest)
                    .AddUserRating(user, 100);
            }

            // Items, cells, user cells
            var itemValue = numberOfItems > 0 ? 100M / numberOfItems : 0;
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = string.Format("Item {0}", i);

                var item = element.AddItem(itemName);

                if (addResourcePoolField)
                    item.AddCell(element.DirectIncomeField).SetValue(100M);

                if (addMultiplierField)
                    item.AddCell(element.MultiplierField).SetValue(0M);

                if (addImportanceIndex)
                    item.AddCell(importanceField).SetValue(itemValue);
            }

            // Return
            return resourcePool;
        }

        #endregion
    }
}
