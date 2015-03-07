namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolRepository
    {
        DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }

        public async Task<UserResourcePool> FindUserResourcePoolAsync(int userId, int resourcePoolId)
        {
            return await UserResourcePoolSet
                .Get(item => item.UserId == userId && item.ResourcePoolId == resourcePoolId)
                .SingleOrDefaultAsync();
        }

        public async Task<ResourcePool> FindByUserResourcePoolIdAsync(int userResourcePoolId)
        {
            var list = ResourcePoolSet.Get(item => item.UserResourcePoolSet.Any(item2 => item2.Id == userResourcePoolId));

            return list.Any()
                ? await list.SingleOrDefaultAsync()
                : null;
        }

        #region - Samples -

        public ResourcePool CreateUPOSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("UPO", "Organization", user, null, true, true, false, 1);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
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
            var resourcePool = CreateDefaultResourcePool("Basics - Existing Model", "Organization", user, null, true, true, false, 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Organization A";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsNewSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Basics - New Model", "Organization", user, 50, true, true, true, 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "-";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Organization A";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateSectorIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Sector Index Sample", "Organization", user, 50, true, true, false, 6);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Sector element
            var sectorElement = resourcePool.AddElement("Sector");

            // Importance field
            var importanceField = sectorElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                    .AddIndex("Sector Index", RatingSortType.HighestToLowest)
                    .AddUserRating(user, 100);

            // Items, cells, user cells
            var itemValue = 100M / 6;
            sectorElement.AddItem("Clothing").AddCell(importanceField).SetValue(itemValue, user);
            sectorElement.AddItem("Cosmetics").AddCell(importanceField).SetValue(itemValue, user);
            sectorElement.AddItem("Education").AddCell(importanceField).SetValue(itemValue, user);
            sectorElement.AddItem("Entertainment").AddCell(importanceField).SetValue(itemValue, user);
            sectorElement.AddItem("Food").AddCell(importanceField).SetValue(itemValue, user);
            sectorElement.AddItem("Healthcare").AddCell(importanceField).SetValue(itemValue, user);

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var sectorField = mainElement.AddField("Sector", ElementFieldTypes.Element);
            sectorField.SelectedElement = sectorElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Clothing Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(0).Take(1).Single());
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(1).Take(1).Single());
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(2).Take(1).Single());
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(3).Take(1).Single());
            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "Food Organization";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(4).Take(1).Single());
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(sectorField).SetValue(sectorElement.ElementItemSet.Skip(5).Take(1).Single());

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
            const byte numberOfLicenses = 2;
            const decimal ratingPerLicense = 100 / numberOfLicenses;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index Sample", "Organization", user, 50, true, true, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldTypes.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldTypes.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldTypes.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldTypes.String);
            var importanceField = licenseElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldTypes.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Open Source Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(0).Take(1).Single());
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Commercial Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(1).Take(1).Single());

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative(User user)
        {
            const byte numberOfLicenses = 6;
            const decimal ratingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index - Popular Software Licenses", "Organization", user, 50, true, true, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var linkField = licenseElement.AddField("Link", ElementFieldTypes.String);
            var importanceField = licenseElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            licenseElement.AddItem("Apache-2.0").AddCell(linkField)
                .SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            licenseElement.AddItem("BSD-3-Clause")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            licenseElement.AddItem("GPL-3.0")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            licenseElement.AddItem("LGPL-3.0")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            licenseElement.AddItem("MIT")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            // TODO Check it again
            licenseElement.AddItem("Microsoft EULA")
                .AddCell(linkField).SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField).SetValue(ratingPerLicense, user);

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldTypes.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0 Organization";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(0).Take(1).Single());
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause Organization";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(1).Take(1).Single());
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "GPL-3.0 Organization";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(2).Take(1).Single());
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0 Organization";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(3).Take(1).Single());
            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "MIT Organization";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(4).Take(1).Single());
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Microsoft EULA Organization";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(5).Take(1).Single());

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative2(User user)
        {
            const byte numberOfLicenses = 6;
            const decimal ratingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index - Popular Software Licenses", "License", user, null, false, false, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            var linkField = mainElement.AddField("Link", ElementFieldTypes.String);
            var importanceField = mainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "MIT";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Microsoft EULA";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(linkField).SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSample(User user)
        {
            const byte numberOfLicenses = 6;
            const decimal ratingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index - Popular Software Licenses", "License", user, null, false, false, false, numberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            var importanceField = mainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Apache-2.0</a>");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>BSD-3-Clause</a>");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>GPL-3.0</a>");
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>LGPL-3.0</a>");
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "MIT";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().NameCell.SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>MIT</a>");
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Microsoft EULA";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().NameCell.SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Microsoft EULA</a>");
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(importanceField).SetValue(ratingPerLicense, user);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexExistingSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Total Cost Index - Existing Model", "Product", user, null, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "High Profit";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(200M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(150M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().ResourcePoolCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexNewSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Total Cost Index - New Model", "Product", user, 101, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            mainElement.ResourcePoolField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "High Profit";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(200M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(150M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().ResourcePoolCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexNewSystemAftermathSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Total Cost Index - New Model - Aftermath", "Product", user, 101, true, true, false, 3);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            mainElement.MultiplierField.SortOrder = 3;

            // Resource pool index; use to Sales Price itself
            mainElement.ResourcePoolField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "<s>High Profit</s>";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "<s>Average Profit</s>";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().ResourcePoolCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexSampleOld(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Total Cost Index Sample", "Organization", user, 100, true, true, false, 2);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            resourcePool.MainElement.ResourcePoolField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(125M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(175M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateFairShareSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Fair Share Index", "Organization", user, userResourcePoolRate :50, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Fair share element
            var fairShareElement = resourcePool.AddElement("Fair Share");

            // Fields
            var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            var fairShareImportanceField = fairShareElement.AddField("-", ElementFieldTypes.Decimal, false);
            fairShareImportanceField
                .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            decimal ratingPerItem = 100 / 2;
            var fairShareYesItem = fairShareElement.AddItem("Sharer")
                .AddCell(fairShareDesciptionField).SetValue("Indicates the organization shares it's income with its employees based on their contributions").ElementItem
                .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            var fairShareNoItem = fairShareElement.AddItem("Keeper")
                .AddCell(fairShareDesciptionField).SetValue("Indicates that the owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
                .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
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

        public ResourcePool CreateIndexPieSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Index Pie", "Organization", user, userResourcePoolRate: 50, addResourcePoolField: true, addMultiplierField: true, addImportanceIndex: false, numberOfItems: 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldTypes.String);
            //var fairShareImportanceField = fairShareElement.AddField("-", ElementFieldTypes.Decimal, false);
            //fairShareImportanceField
            //    .AddIndex("Fair Share Index", RatingSortType.HighestToLowest)
            //    .AddUserRating(user, 100);

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("Indicates the organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("Indicates that the owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // 1. index
            mainElement.ResourcePoolField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100 / 3);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "-";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // 2. index
            var importanceField1 = resourcePool.MainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField1
                .AddIndex("Importance Index 1", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100 / 3);

            // 3. index
            var importanceField2 = resourcePool.MainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField2
                .AddIndex("Importance Index 2", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100 / 3);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Organization A";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(200M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField1).SetValue(100M, user);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField2).SetValue(50M, user);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField1).SetValue(50M, user);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField2).SetValue(25M, user);
            
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

        public ResourcePool CreateDefaultResourcePool(string resourcePoolName, string mainElementName, User user, decimal? userResourcePoolRate, bool addResourcePoolField, bool addMultiplierField, bool addImportanceIndex, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(resourcePoolName);

            // User resource pool
            if (userResourcePoolRate.HasValue)
                resourcePool.AddUserResourcePool(user, userResourcePoolRate.Value);

            var element = resourcePool.AddElement(mainElementName);

            // Resource pool field
            if (addResourcePoolField)
                element.AddField("Resource Pool Field", ElementFieldTypes.ResourcePool, true);

            // Multiplier field
            if (addMultiplierField)
                element.AddField("Multiplier", ElementFieldTypes.Multiplier);

            // Importance field
            ElementField importanceField = null;
            if (addImportanceIndex)
            {
                importanceField = resourcePool.MainElement.AddField("Importance Field", ElementFieldTypes.Decimal, false);
                importanceField
                    .AddIndex("Importance Index", RatingSortType.HighestToLowest)
                    .AddUserRating(user, 100);
            }

            // Items, cells, user cells
            var itemValue = numberOfItems > 0 ? 100M / numberOfItems : 0;
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = string.Format("Item {0}", i);

                var item = resourcePool.MainElement.AddItem(itemName);

                if (addResourcePoolField)
                    item.AddCell(resourcePool.MainElement.ResourcePoolField).SetValue(100M);

                if (addMultiplierField)
                    item.AddCell(resourcePool.MainElement.MultiplierField).SetValue(0M, user);

                if (addImportanceIndex)
                    item.AddCell(importanceField).SetValue(itemValue, user);
            }

            // Return
            return resourcePool;
        }

        #endregion
    }
}
