using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ResourcePoolManager : IDisposable
    {
        // Fields
        private readonly WealthEconomyContext _context = new WealthEconomyContext();
        private bool _disposed;
        private readonly DbSet<ElementCell> _elementCellStore;
        private readonly DbSet<ElementField> _elementFieldStore;
        private readonly DbSet<ElementItem> _elementItemStore;
        private readonly DbSet<Element> _elementStore;
        private readonly DbSet<ResourcePool> _resourcePoolStore;
        private readonly DbSet<UserElementCell> _userElementCellStore;
        private readonly DbSet<UserElementField> _userElementFieldStore;

        public ResourcePoolManager()
        {
            _elementStore = _context.Set<Element>();
            _elementCellStore = _context.Set<ElementCell>();
            _elementFieldStore = _context.Set<ElementField>();
            _elementItemStore = _context.Set<ElementItem>();
            _resourcePoolStore = _context.Set<ResourcePool>();
            _userElementCellStore = _context.Set<UserElementCell>();
            _userElementFieldStore = _context.Set<UserElementField>();
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

        public IQueryable<Element> GetElementSet(int? elementId, bool liveFilter = true, params Expression<Func<Element, object>>[] includeProperties)
        {
            var query = _elementStore.GetAll(liveFilter, includeProperties);

            if (elementId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementId.Value);
            }

            return query;
        }

        public IQueryable<ElementCell> GetElementCellSet(int? elementCellId, bool liveFilter = true, params Expression<Func<ElementCell, object>>[] includeProperties)
        {
            var query = _elementCellStore.GetAll(liveFilter, includeProperties);

            if (elementCellId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementCellId.Value);
            }

            return query;
        }

        public IQueryable<ElementField> GetElementFieldSet(int? elementFieldId, bool liveFilter = true, params Expression<Func<ElementField, object>>[] includeProperties)
        {
            var query = _elementFieldStore.GetAll(liveFilter, includeProperties);

            if (elementFieldId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementFieldId.Value);
            }

            return query;
        }

        public IQueryable<ElementItem> GetElementItemSet(int? elementItemId, bool liveFilter = true, params Expression<Func<ElementItem, object>>[] includeProperties)
        {
            var query = _elementItemStore.GetAll(liveFilter, includeProperties);

            if (elementItemId.HasValue)
            {
                query = query.Where(entity => entity.Id == elementItemId.Value);
            }

            return query;
        }

        public IQueryable<ResourcePool> GetResourcePoolSet(int? resourcePoolId = null, bool liveFilter = true, params Expression<Func<ResourcePool, object>>[] includeProperties)
        {
            var query = _resourcePoolStore.GetAll(liveFilter, includeProperties);

            if (resourcePoolId.HasValue)
            {
                query = query.Where(entity => entity.Id == resourcePoolId.Value);
            }

            return query;
        }

        public IQueryable<UserElementCell> GetUserElementCellSet(int? userId = null, int? elementCellId = null, bool liveFilter = true, params Expression<Func<UserElementCell, object>>[] includeProperties)
        {
            var query = _userElementCellStore.GetAll(liveFilter, includeProperties);

            if (userId.HasValue && elementCellId.HasValue)
            {
                query = query.Where(entity => entity.UserId == userId && entity.ElementCellId == elementCellId.Value);
            }

            return query;
        }

        public IQueryable<UserElementField> GetUserElementFieldSet(int? userId = null, int? elementFieldId = null, bool liveFilter = true, params Expression<Func<UserElementField, object>>[] includeProperties)
        {
            var query = _userElementFieldStore.GetAll(liveFilter, includeProperties);

            if (userId.HasValue && elementFieldId.HasValue)
            {
                query = query.Where(entity => entity.UserId == userId && entity.ElementFieldId == elementFieldId.Value);
            }

            return query;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task UpdateComputedFieldsAsync(int resourcePoolId)
        {
            var resourcePool = await GetResourcePoolSet(resourcePoolId).SingleOrDefaultAsync();

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

        private void UpdateElementCellComputedFields(ResourcePool resourcePool)
        {
            var query = GetElementCellSet(null, true, cell => cell.ElementField, cell => cell.UserElementCellSet)
                .Where(cell => cell.ElementField.Element.ResourcePool.Id == resourcePool.Id
                    && cell.ElementField.DataType == (byte)ElementFieldDataType.Decimal);

            var cells = query.AsEnumerable(); // TODO?

            foreach (var cell in cells)
            {
                cell.NumericValueTotal = cell.UserElementCellSet.Sum(userCell =>
                {
                    switch (userCell.ElementCell.ElementField.DataType)
                    {
                        case (byte)ElementFieldDataType.Decimal: return userCell.DecimalValue.GetValueOrDefault();
                        default: return 0;
                    }
                });

                cell.NumericValueCount = cell.UserElementCellSet.Count;
            }
        }

        private void UpdateElementFieldComputedFields(ResourcePool resourcePool)
        {
            var query = GetElementFieldSet(null, true, field => field.UserElementFieldSet)
                .Where(field => field.IndexEnabled
                    && field.Element.ResourcePool.Id == resourcePool.Id);

            var fields = query.AsEnumerable();

            foreach (var field in fields)
            {
                field.IndexRatingTotal = field.UserElementFieldSet.Sum(userElementField => userElementField.Rating);
                field.IndexRatingCount = field.UserElementFieldSet.Count;
            }
        }

        private void UpdateResourcePoolComputedFields(ResourcePool resourcePool)
        {
            // Rating count
            var userCellQuery = GetUserElementCellSet()
                .Where(entity => entity.ElementCell.ElementField.IndexEnabled
                    && entity.ElementCell.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(entity => entity.User);

            var userFieldQuery = GetUserElementFieldSet()
                .Where(entity => entity.ElementField.IndexEnabled
                    && entity.ElementField.Element.ResourcePool.Id == resourcePool.Id)
                .Select(entity => entity.User);

            var ratingCount = userCellQuery.Union(userFieldQuery)
                .Distinct()
                .Count();

            resourcePool.RatingCount = ratingCount;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                _context.Dispose();
            }

            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
