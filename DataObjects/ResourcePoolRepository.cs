namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolRepository
    {
        const int DEFAULTNUMBEROFITEMS = 2;

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

        public ResourcePool CreateBasicSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, false, false, false, true, 2);
            resourcePool.Name = "Basic Sample";
            resourcePool.InitialValue = 100;
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.NameField.Name = "Organization";
            //mainElement.ResourcePoolField.Name = "Sales Price";
            //mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Organization A";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Organization B";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateSectorIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, true, true, true, true, 9);
            resourcePool.Name = "Sector Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Sector";
            mainElement.NameField.Name = "Sector";
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Basic Materials";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Conglomerates";
            mainElement.ElementItemSet.Skip(2).Take(1).Single().Name = "Consumer Goods";
            mainElement.ElementItemSet.Skip(3).Take(1).Single().Name = "Financial";
            mainElement.ElementItemSet.Skip(4).Take(1).Single().Name = "Healthcare";
            mainElement.ElementItemSet.Skip(5).Take(1).Single().Name = "Industrial Goods";
            mainElement.ElementItemSet.Skip(6).Take(1).Single().Name = "Services";
            mainElement.ElementItemSet.Skip(7).Take(1).Single().Name = "Technology";
            mainElement.ElementItemSet.Skip(8).Take(1).Single().Name = "Utilities";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, true);
            resourcePool.Name = "Knowledge Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "License";
            mainElement.NameField.Name = "License";
            mainElement.ResourcePoolField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Open Source License";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "Restricted License";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, false);
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

        public ResourcePool CreateDefaultResourcePool(User user, bool addImportanceIndex)
        {
            return CreateDefaultResourcePool(user, true, true, true, addImportanceIndex, DEFAULTNUMBEROFITEMS);
        }

        public ResourcePool CreateDefaultResourcePool(User user, bool addUserResourcePool, bool addResourcePoolField, bool addMultiplierField, bool addImportanceIndex, short numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool("Default");

            // User resource pool
            if (addUserResourcePool)
                resourcePool.AddUserResourcePool(user, 101);

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
