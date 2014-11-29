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

        public ResourcePool CreateSectorIndexSample(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user, 9);
            resourcePool.Name = "Sector Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Sector";
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
            var resourcePool = CreateDefaultResourcePool(user);
            resourcePool.Name = "Knowledge Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "License";
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
            var resourcePool = CreateDefaultResourcePool(user);
            resourcePool.Name = "Total Cost Index Sample";
            resourcePool.IsSample = true;

            // Main element
            var mainElement = resourcePool.MainElement;
            mainElement.Name = "Organization";
            mainElement.ResourcePoolField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Sales Number";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).Take(1).Single().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).Take(1).Single().ResourcePoolCell.DecimalValue = 125;
            mainElement.ElementItemSet.Skip(1).Take(1).Single().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).Take(1).Single().ResourcePoolCell.DecimalValue = 175;

            // Return
            return resourcePool;
        }

        public ResourcePool CreateDefaultResourcePool(User user)
        {
            return CreateDefaultResourcePool(user, DEFAULTNUMBEROFITEMS);
        }

        public ResourcePool CreateDefaultResourcePool(User user, short numberOfItems)
        {
            // Resource pool
            var resourcePool = new ResourcePool("Default");

            // Main element
            var mainElement = new Element(resourcePool, "Main Element") { IsMainElement = true };
            resourcePool.AddElement(mainElement);

            // Fields
            var nameField = new ElementField() { Name = "Name", ElementFieldType = (byte)ElementFieldType.String };
            var resourcePoolField = new ElementField() { Name = "Resource Pool Field", ElementFieldType = (byte)ElementFieldType.ResourcePool };
            var multiplierField = new ElementField() { Name = "Multiplier", ElementFieldType = (byte)ElementFieldType.Multiplier };

            mainElement
                .AddField(nameField)
                .AddField(resourcePoolField)
                .AddField(multiplierField);

            // Importance Index
            // TODO Will be updated with new field / index combo
            var importanceIndex = new ResourcePoolIndex() { Name = "Importance Index", ElementField = nameField, RatingSortType = (byte)RatingSortType.HighestToLowest };
            resourcePool.AddIndex(importanceIndex);

            // Items, cell, user cells
            var itemRating = numberOfItems > 0 ? 100 / numberOfItems : 0;

            for (var i = 1; i <= numberOfItems; i++)
            {
                // Item
                var itemName = string.Format("Item {0}", i);

                // TODO Try to do this part more fluent by using constructors
                // Set element in the constructor, currently it's doing it in both here and in AddItem() method
                var item = new ElementItem() { Element = mainElement, Name = itemName }
                        .AddCell(new ElementCell() { ElementField = resourcePoolField, DecimalValue = 100 })
                        .AddCell(new ElementCell() { ElementField = multiplierField, DecimalValue = 0 });
                mainElement.AddItem(item);

                // User rating for the item
                item.NameCell.AddUserCell(new UserElementCell() { User = user, Rating = itemRating });
            }

            // User resource pool, index
            resourcePool
                .AddUserResourcePool(new UserResourcePool() { User = user, ResourcePoolRate = 101 }
                    .AddIndex(new UserResourcePoolIndex() { ResourcePoolIndex = importanceIndex, Rating = 100 }));

            // Return
            return resourcePool;
        }
    }
}
