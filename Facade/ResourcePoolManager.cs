namespace forCrowd.WealthEconomy.Facade
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.DataObjects;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ResourcePoolManager : IDisposable
    {
        // Fields
        WealthEconomyContext _context = new WealthEconomyContext();
        bool disposed = false;
        DbSet<ElementCell> _elementCellStore = null;
        DbSet<ElementField> _elementFieldStore = null;
        DbSet<ElementItem> _elementItemStore = null;
        DbSet<Element> _elementStore = null;
        DbSet<ResourcePool> _resourcePoolStore = null;
        DbSet<UserElementCell> _userElementCellStore = null;
        DbSet<UserElementField> _userElementFieldStore = null;
        DbSet<UserResourcePool> _userResourcePoolStore = null;

        public ResourcePoolManager()
        {
            _elementStore = _context.Set<Element>();
            _elementCellStore = _context.Set<ElementCell>();
            _elementFieldStore = _context.Set<ElementField>();
            _elementItemStore = _context.Set<ElementItem>();
            _resourcePoolStore = _context.Set<ResourcePool>();
            _userElementCellStore = _context.Set<UserElementCell>();
            _userElementFieldStore = _context.Set<UserElementField>();
            _userResourcePoolStore = _context.Set<UserResourcePool>();
        }

        public async Task<int> AddElementAsync(Element entity)
        {
            _elementStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddElementCellAsync(ElementCell entity)
        {
            _elementCellStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddElementFieldAsync(ElementField entity)
        {
            _elementFieldStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddElementItemAsync(ElementItem entity)
        {
            _elementItemStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddResourcePoolAsync(ResourcePool entity)
        {
            _resourcePoolStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddUserElementCellAsync(UserElementCell entity)
        {
            _userElementCellStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddUserElementFieldAsync(UserElementField entity)
        {
            _userElementFieldStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> AddUserResourcePoolAsync(UserResourcePool entity)
        {
            _userResourcePoolStore.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteElementAsync(int elementId)
        {
            var entity = await GetElementSet(elementId).SingleOrDefaultAsync();
            _elementStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteElementCellAsync(int elementCellId)
        {
            var entity = await GetElementCellSet(elementCellId).SingleOrDefaultAsync();
            _elementCellStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteElementFieldAsync(int elementFieldId)
        {
            var entity = await GetElementFieldSet(elementFieldId).SingleOrDefaultAsync();
            _elementFieldStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteElementItemAsync(int elementItemId)
        {
            var entity = await GetElementItemSet(elementItemId).SingleOrDefaultAsync();
            _elementItemStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteResourcePoolAsync(int resourcePoolId)
        {
            var entity = await GetResourcePoolSet(resourcePoolId).SingleOrDefaultAsync();
            _resourcePoolStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteUserElementCellAsync(int userId, int elementCellId)
        {
            var entity = await GetUserElementCellSet(userId, elementCellId).SingleOrDefaultAsync();
            _userElementCellStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteUserElementFieldAsync(int userId, int elementFieldId)
        {
            var entity = await GetUserElementFieldSet(userId, elementFieldId).SingleOrDefaultAsync();
            _userElementFieldStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteUserResourcePoolAsync(int userId, int resourcePoolId)
        {
            var entity = await GetUserResourcePoolSet(userId, resourcePoolId).SingleOrDefaultAsync();
            _userResourcePoolStore.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public IQueryable<Element> GetElementSet(int? elementId, bool live = true, params Expression<Func<Element, object>>[] includeProperties)
        {
            var query = _elementStore.GetAll(live, includeProperties);

            if (elementId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementId.Value);
            }

            return query;
        }

        public IQueryable<ElementCell> GetElementCellSet(int? elementCellId, bool live = true, params Expression<Func<ElementCell, object>>[] includeProperties)
        {
            var query = _elementCellStore.GetAll(live, includeProperties);

            if (elementCellId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementCellId.Value);
            }

            return query;
        }

        public IQueryable<ElementField> GetElementFieldSet(int? elementFieldId, bool live = true, params Expression<Func<ElementField, object>>[] includeProperties)
        {
            var query = _elementFieldStore.GetAll(live, includeProperties);

            if (elementFieldId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementFieldId.Value);
            }

            return query;
        }

        public IQueryable<ElementItem> GetElementItemSet(int? elementItemId, bool live = true, params Expression<Func<ElementItem, object>>[] includeProperties)
        {
            var query = _elementItemStore.GetAll(live, includeProperties);

            if (elementItemId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementItemId.Value);
            }

            return query;
        }

        public IQueryable<ResourcePool> GetResourcePoolSet(int? resourcePoolId = null, bool live = true, params Expression<Func<ResourcePool, object>>[] includeProperties)
        {
            var query = _resourcePoolStore.GetAll(live, includeProperties);

            if (resourcePoolId.HasValue)
            {
                query = query.Where(entity => entity.Id == resourcePoolId.Value);
            }

            return query;
        }

        public IQueryable<UserElementCell> GetUserElementCellSet(int? userId = null, int? elementCellId = null, bool live = true, params Expression<Func<UserElementCell, object>>[] includeProperties)
        {
            var query = _userElementCellStore.GetAll(live, includeProperties);

            if (userId.HasValue && elementCellId.HasValue)
            {
                query = query.Where(entity => entity.UserId == userId && entity.ElementCellId == elementCellId.Value);
            }

            return query;
        }

        public IQueryable<UserElementField> GetUserElementFieldSet(int? userId = null, int? elementFieldId = null, bool live = true, params Expression<Func<UserElementField, object>>[] includeProperties)
        {
            var query = _userElementFieldStore.GetAll(live, includeProperties);

            if (userId.HasValue && elementFieldId.HasValue)
            {
                query = query.Where(entity => entity.UserId == userId && entity.ElementFieldId == elementFieldId.Value);
            }

            return query;
        }

        public IQueryable<UserResourcePool> GetUserResourcePoolSet(int? userId = null, int? resourcePoolId = null, bool live = true, params Expression<Func<UserResourcePool, object>>[] includeProperties)
        {
            var query = _userResourcePoolStore.GetAll(live, includeProperties);

            if (userId.HasValue && resourcePoolId.HasValue)
            {
                query = query.Where(entity => entity.UserId == userId && entity.ResourcePoolId == resourcePoolId.Value);
            }

            return query;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task UpdateComputedFieldsAsync(int resourcePoolId)
        {
            var resourcePool = await GetResourcePoolSet(resourcePoolId, true, entity => entity.UserResourcePoolSet).SingleOrDefaultAsync();

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
            var query = _elementCellStore
                .Where(entity => !entity.DeletedOn.HasValue)
                .Include(cell => cell.ElementField)
                .Include(cell => cell.UserElementCellSet);

            var list = query
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
            var query = _elementFieldStore
                .Where(entity => !entity.DeletedOn.HasValue)
                .Include(field => field.UserElementFieldSet);

            var list = query
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
            var userCellQuery = _userElementCellStore.Where(entity => !entity.DeletedOn.HasValue)
                .Where(item => item.ElementCell.ElementField.IndexEnabled
                    && item.ElementCell.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var userFieldQuery = _userElementFieldStore.Where(entity => !entity.DeletedOn.HasValue)
                .Where(item => item.ElementField.IndexEnabled
                    && item.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var userResourcePoolQuery = _userResourcePoolStore.Where(entity => !entity.DeletedOn.HasValue)
                .Where(item => !item.ResourcePool.UseFixedResourcePoolRate
                    && item.ResourcePool.Id == resourcePool.Id)
                .Select(item => item.User);

            var ratingCount = userCellQuery.Union(userFieldQuery.Union(userResourcePoolQuery))
                .Distinct()
                .Count();

            resourcePool.RatingCount = ratingCount;

            // Resource pool rate
            resourcePool.ResourcePoolRateTotal = resourcePool.UserResourcePoolSet.Sum(userResourcePool => userResourcePool.ResourcePoolRate);
            resourcePool.ResourcePoolRateCount = resourcePool.UserResourcePoolSet.Count();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                _context.Dispose();
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
