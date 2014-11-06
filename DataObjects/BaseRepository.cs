namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class BaseRepository<TEntityType> : IRepository<TEntityType> where TEntityType : class, IEntity
    {
        readonly DbSet<TEntityType> dbSet;

        public BaseRepository(DbContext context)
        {
            Context = context;
            dbSet = Context.Set<TEntityType>();
        }

        public DbContext Context { get; private set; }

        public IQueryable<TEntityType> All
        {
            get { return dbSet; }
        }

        public IQueryable<TEntityType> AllLive
        {
            get { return dbSet.Where(entity => !entity.DeletedOn.HasValue); }
        }

        public IQueryable<TEntityType> AllIncluding(params Expression<Func<TEntityType, object>>[] includeProperties)
        {
            return AllIncludingBase(All, includeProperties);
        }

        public IQueryable<TEntityType> AllLiveIncluding(params Expression<Func<TEntityType, object>>[] includeProperties)
        {
            return AllIncludingBase(AllLive, includeProperties);
        }

        IQueryable<TEntityType> AllIncludingBase(IQueryable<TEntityType> baseQuery, params Expression<Func<TEntityType, object>>[] includeProperties)
        {
            var query = baseQuery;
            foreach (var includeProperty in includeProperties)
                query = query.Include(includeProperty);
            return query;
        }

        public TEntityType Find(params object[] keyValues)
        {
            return dbSet.Find(keyValues);
        }

        public async Task<TEntityType> FindAsync(params object[] keyValues)
        {
            return await dbSet.FindAsync(keyValues);
        }

        public bool Exists(params object[] keyValues)
        {
            return Find(keyValues) != null;
        }

        public void Insert(TEntityType entity)
        {
            dbSet.Add(entity);
        }

        [Obsolete]
        public void Update(TEntityType entity)
        {

        }

        public void Delete(params object[] keyValues)
        {
            var entity = dbSet.Find(keyValues);
            dbSet.Remove(entity);
        }

        public void DeleteRange(IEnumerable<TEntityType> entities)
        {
            dbSet.RemoveRange(entities);
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
