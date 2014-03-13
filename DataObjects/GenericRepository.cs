namespace DataObjects
{
    using BusinessObjects;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

    public abstract class GenericRepository<TEntityType, TPrimaryKeyType> : IGenericRepository<TEntityType, TPrimaryKeyType>
        where TEntityType : class, IEntity<TPrimaryKeyType>
        where TPrimaryKeyType : struct
    {
        readonly DbSet<TEntityType> dbSet;

        protected GenericRepository(DbContext context)
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

        public TEntityType Find(object id)
        {
            return dbSet.Find(id);
        }

        public async Task<TEntityType> FindAsync(object id)
        {
            return await dbSet.FindAsync(id);
        }

        public void InsertOrUpdate(TEntityType entity)
        {
            if (entity.Id.Equals(default(TPrimaryKeyType)))
            {
                entity.CreatedOn = DateTime.Now;
                entity.ModifiedOn = DateTime.Now;
                dbSet.Add(entity);
            }
            else
            {
                entity.ModifiedOn = DateTime.Now;
                Context.Entry(entity).State = EntityState.Modified;
            }
        }

        public void Delete(object id)
        {
            var entity = dbSet.Find(id);
            dbSet.Remove(entity);
        }

        public void DeleteRange(IEnumerable<TEntityType> entities)
        {
            dbSet.RemoveRange(entities);
        }

        public int Save()
        {
            return Context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await Context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
