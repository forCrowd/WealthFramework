namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolRepository
    {
        // const int DEFAULTNUMBEROFITEMS = 2;

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

        public ResourcePool CreateUPOSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("UPO", "Organization", user, false, true, true, false, 1);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "UPO";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsExistingSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Basics - Existing Model", "Organization", user, false, true, true, false, 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Organization A";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsNewSystemSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Basics - New Model", "Organization", user, true, true, true, true, 2);
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Sales Number";
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
            var resourcePool = CreateDefaultResourcePool("Sector Index Sample", "Organization", user, true, true, true, false, 6);
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
            mainElement.MultiplierField.Name = "Sales Number";
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
            const byte NumberOfLicenses = 2;
            const decimal RatingPerLicense = 100 / 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index Sample", "License", user, false, false, false, false, NumberOfLicenses);
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;

            // Fields
            //mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            //mainElement.MultiplierField.Name = "Sales Number";
            var rightToUseField = mainElement.AddField("Right to Use", ElementFieldTypes.String);
            var rightToCopyField = mainElement.AddField("Right to Copy", ElementFieldTypes.String);
            var rightToModifyField = mainElement.AddField("Right to Modify", ElementFieldTypes.String);
            var rightToSellField = mainElement.AddField("Right to Sell", ElementFieldTypes.String);
            var importanceField = mainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Open Source License";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(rightToUseField).SetValue("Yes");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(rightToCopyField).SetValue("Yes");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(rightToModifyField).SetValue("Yes");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(rightToSellField).SetValue("Yes");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Restricted License";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(rightToUseField).SetValue("Yes");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(rightToCopyField).SetValue("No");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(rightToModifyField).SetValue("No");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(rightToSellField).SetValue("No");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicense(User user)
        {
            const byte numberOfLicenses = 6;
            const decimal ratingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index - Popular Software Licenses", "Organization", user, true, true, true, false, numberOfLicenses);
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
            mainElement.MultiplierField.Name = "Sales Number";
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
        
        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseOld(User user)
        {
            const byte numberOfLicenses = 6;
            const decimal ratingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Knowledge Index - Popular Software Licenses", "License", user, false, false, false, false, numberOfLicenses);
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

        public ResourcePool CreateTotalCostIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool("Total Cost Index Sample", "Organization", user, true, true, true, false, 2);
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Sales Number";

            // Resource pool index; change it to Sales Price itself, instead of User ratings
            resourcePool.MainElement.ResourcePoolField
                .AddIndex("Total Cost Index", RatingSortType.LowestToHighest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.SetValue(125M);
            mainElement.ElementItemSet.Skip(0).Take(1).Single().NameCell.UserElementCellSet.Clear();
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.SetValue(175M);
            mainElement.ElementItemSet.Skip(1).Take(1).Single().NameCell.UserElementCellSet.Clear();

            // Return
            return resourcePool;
        }

        public ResourcePool CreateDefaultResourcePool(string resourcePoolName, string mainElementName, User user, bool addUserResourcePool, bool addResourcePoolField, bool addMultiplierField, bool addImportanceIndex, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(resourcePoolName);

            // User resource pool
            if (addUserResourcePool)
                resourcePool.AddUserResourcePool(user, 50);

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
    }
}
