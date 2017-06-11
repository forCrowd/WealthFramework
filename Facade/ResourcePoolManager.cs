namespace forCrowd.WealthEconomy.Facade
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;

    public interface IResourcePoolManager
    {
        IQueryable<ResourcePool> All { get; }
        IQueryable<ResourcePool> AllLive { get; }

        Task<int> DeleteAsync(int resourcePoolId);
        Task<ResourcePool> GetByIdAsync(int resourcePoolId, bool live = true, params Expression<Func<ResourcePool, object>>[] includeProperties);
        Task<int> InsertAsync(ResourcePool entity);
        Task<int> SaveChangesAsync();
        Task UpdateComputedFieldsAsync(int resourcePoolId);
    }

    public class ResourcePoolManager : IResourcePoolManager, IDisposable
    {
        public IQueryable<ResourcePool> All { get { return ResourcePoolStore; } }
        public IQueryable<ResourcePool> AllLive { get { return ResourcePoolStore.Where(entity => !entity.DeletedOn.HasValue); } }

        bool disposed = false;
        WealthEconomyContext Context { get; set; }
        BaseRepository<ElementCell> ElementCellStore { get; set; }
        BaseRepository<ElementField> ElementFieldStore { get; set; }
        DbSet<ResourcePool> ResourcePoolStore { get; set; }
        BaseRepository<UserElementCell> UserElementCellStore { get; set; }
        BaseRepository<UserElementField> UserElementFieldStore { get; set; }
        BaseRepository<UserResourcePool> UserResourcePoolStore { get; set; }

        public ResourcePoolManager()
        {
            Context = new WealthEconomyContext();
            ElementCellStore = new BaseRepository<ElementCell>(Context);
            ElementFieldStore = new BaseRepository<ElementField>(Context);
            ResourcePoolStore = Context.Set<ResourcePool>();
            UserElementCellStore = new BaseRepository<UserElementCell>(Context);
            UserElementFieldStore = new BaseRepository<UserElementField>(Context);
            UserResourcePoolStore = new BaseRepository<UserResourcePool>(Context);
        }

        public async Task<int> DeleteAsync(int resourcePoolId)
        {
            var resourcePool = await GetByIdAsync(resourcePoolId);

            if (resourcePool == null)
            {
                return 0;
            }

            ResourcePoolStore.Remove(resourcePool);

            return await Context.SaveChangesAsync();
        }

        public async Task<ResourcePool> GetByIdAsync(int resourcePoolId, bool live = true, params Expression<Func<ResourcePool, object>>[] includeProperties)
        {
            // Main query
            var query = ResourcePoolStore.AsQueryable().Where(entity => entity.Id == resourcePoolId);

            // Filter deleted records
            if (live)
            {
                query = query.Where(entity => !entity.DeletedOn.HasValue);
            }

            // Include properties
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            // Return
            return await query.SingleOrDefaultAsync();
        }

        public async Task<int> InsertAsync(ResourcePool entity)
        {
            ResourcePoolStore.Add(entity);
            return await Context.SaveChangesAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await Context.SaveChangesAsync();
        }

        public async Task UpdateComputedFieldsAsync(int resourcePoolId)
        {
            var resourcePool = await GetByIdAsync(resourcePoolId);

            if (resourcePool == null)
            {
                throw new KeyNotFoundException($"No resource pool found with id {resourcePoolId}");
            }

            resourcePool.ModifiedOn = DateTime.UtcNow;

            UpdateResourcePoolComputedFields(resourcePool);

            UpdateElementFieldComputedFields(resourcePool);

            UpdateElementCellComputedFields(resourcePool);

            await SaveChangesAsync();
        }

        void UpdateElementCellComputedFields(ResourcePool resourcePool)
        {
            var list = ElementCellStore.AllLiveIncluding(cell => cell.ElementField, cell => cell.UserElementCellSet)
                .Where(cell => cell.ElementField.Element.ResourcePool.Id == resourcePool.Id
                    && (cell.ElementField.DataType == (byte)ElementFieldDataType.Boolean
                    || cell.ElementField.DataType == (byte)ElementFieldDataType.Integer
                    || cell.ElementField.DataType == (byte)ElementFieldDataType.Decimal
                    || cell.ElementField.DataType == (byte)ElementFieldDataType.DirectIncome))
                .AsEnumerable(); // TODO?

            foreach (var cell in list)
            {
                cell.NumericValueTotal = cell.UserElementCellSet.Sum(userCell =>
                {
                    switch (userCell.ElementCell.ElementField.DataType)
                    {
                        case (byte)ElementFieldDataType.Boolean: return userCell.BooleanValue.GetValueOrDefault() ? 1 : 0;
                        case (byte)ElementFieldDataType.Integer: return userCell.IntegerValue.GetValueOrDefault();
                        case (byte)ElementFieldDataType.Decimal: return userCell.DecimalValue.GetValueOrDefault();
                        case (byte)ElementFieldDataType.DirectIncome: return userCell.DecimalValue.GetValueOrDefault();
                        default: return 0;
                    }
                });

                cell.NumericValueCount = cell.UserElementCellSet.Count();
            };
        }

        void UpdateElementFieldComputedFields(ResourcePool resourcePool)
        {
            var list = ElementFieldStore.AllLiveIncluding(field => field.UserElementFieldSet)
                .Where(field => field.Element.ResourcePool.Id == resourcePool.Id
                    && field.IndexEnabled)
                .AsEnumerable();

            foreach (var field in list)
            {
                field.IndexRatingTotal = field.UserElementFieldSet.Sum(userElementField => userElementField.Rating);
                field.IndexRatingCount = field.UserElementFieldSet.Count();
            }
        }

        void UpdateResourcePoolComputedFields(ResourcePool resourcePool)
        {
            // Rating count
            var userCellQuery = UserElementCellStore.AllLive
                .Where(item => item.ElementCell.ElementField.IndexEnabled
                    && item.ElementCell.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var userFieldQuery = UserElementFieldStore.AllLive
                .Where(item => item.ElementField.IndexEnabled
                    && item.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var userResourcePoolQuery = UserResourcePoolStore.AllLive
                .Where(item => !item.ResourcePool.UseFixedResourcePoolRate
                    && item.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var ratingCount = userCellQuery.Union(userFieldQuery.Union(userResourcePoolQuery))
                .Distinct()
                .Count();

            resourcePool.RatingCount = ratingCount;

            // Resource pool rate
            var list = AllLive.Include(item => item.UserResourcePoolSet)
                .Where(item => item.Id == resourcePool.Id)
                .AsEnumerable();

            foreach (var item in list)
            {
                item.ResourcePoolRateTotal = item.UserResourcePoolSet.Sum(userResourcePool => userResourcePool.ResourcePoolRate);
                item.ResourcePoolRateCount = item.UserResourcePoolSet.Count();
            };
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                Context.Dispose();
            }

            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
