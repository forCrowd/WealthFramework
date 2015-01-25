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
            var resourcePool = CreateDefaultResourcePool(user, false, true, true, false, 1);
            resourcePool.Name = "UPO";
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.NameField.Name = "Organization";
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
            var resourcePool = CreateDefaultResourcePool(user, false, true, true, false, 2);
            resourcePool.Name = "Basics - Existing Model";
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.NameField.Name = "Organization";
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
            var resourcePool = CreateDefaultResourcePool(user, true, true, true, true, 2);
            resourcePool.Name = "Basics - New Model";
            resourcePool.EnableResourcePoolAddition = false;
            //resourcePool.EnableSubtotals = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.NameField.Name = "Organization";

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
            var resourcePool = CreateDefaultResourcePool(user, false, false, false, true, 6);
            resourcePool.Name = "Sector Index Sample";
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Sector";
            mainElement.NameField.Name = "Sector";

            // Fields
            //mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            //mainElement.MultiplierField.Name = "Sales Number";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "-";
            mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Sector Index";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Clothing";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Cosmetics";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Education";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Entertainment";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "Food";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Healthcare";

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
            var resourcePool = CreateDefaultResourcePool(user, false, false, false, false, NumberOfLicenses);
            resourcePool.Name = "Knowledge Index Sample";
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "License";
            mainElement.NameField.Name = "License";

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
            const byte NumberOfLicenses = 6;
            const decimal RatingPerLicense = 100 / 6;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, false, false, false, false, NumberOfLicenses);
            resourcePool.Name = "Knowledge Index - Popular Software Licenses";
            resourcePool.EnableResourcePoolAddition = false;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "License";
            mainElement.NameField.Name = "License";

            // Fields
            var linkField = mainElement.AddField("Link", ElementFieldTypes.String);
            var importanceField = mainElement.AddField("-", ElementFieldTypes.Decimal, false);
            importanceField
                .AddIndex("Knowledge Index", RatingSortType.HighestToLowest)
                .AddUserRating(user, 100);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(0).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "BSD-3-Clause";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(1).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(2).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "LGPL-3.0";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(3).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "MIT";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(4).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Microsoft EULA";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(linkField).SetValue("<a href='https://msdn.microsoft.com/en-us/library/aa188798(v=office.10).aspx' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(5).Take(1).Single().AddCell(importanceField).SetValue(RatingPerLicense, user);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, true, true, true, false, 2);
            resourcePool.Name = "Total Cost Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.NameField.Name = "Organization";
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

        public ResourcePool CreateDefaultResourcePool(User user, bool addUserResourcePool, bool addResourcePoolField, bool addMultiplierField, bool addImportanceIndex, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool("Default");

            // User resource pool
            if (addUserResourcePool)
                resourcePool.AddUserResourcePool(user, 50);

            var element = resourcePool.AddElement("Main Element");

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
