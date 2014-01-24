namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;

    public abstract class GenericRepository<TEntityType, TPrimaryKeyType> : IGenericRepository<TEntityType, TPrimaryKeyType>
        where TEntityType : class, IEntity<TPrimaryKeyType>
        where TPrimaryKeyType : struct
    {
        DbContext context;
        readonly DbSet<TEntityType> dbSet;

        protected GenericRepository(DbContext context)
        {
            Context = context;
            dbSet = Context.Set<TEntityType>();
        }

        public DbContext Context
        {
            get { return context; }
            private set { context = value; }
        }

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

        public TEntityType Find(TPrimaryKeyType id)
        {
            return dbSet.Find(id);
        }

        public void InsertOrUpdate(TEntityType entity)
        {
            if (entity.Id.Equals(default(TPrimaryKeyType)))
            {
                // New entity
                entity.CreatedOn = DateTime.Now;
                entity.ModifiedOn = DateTime.Now;
                dbSet.Add(entity);
            }
            else
            {
                // Existing entity
                entity.ModifiedOn = DateTime.Now;
                Context.Entry(entity).State = EntityState.Modified;
            }
        }

        public void Delete(TPrimaryKeyType id)
        {
            var entity = dbSet.Find(id);
            dbSet.Remove(entity);
        }

        public void Save()
        {
            Context.SaveChanges();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
