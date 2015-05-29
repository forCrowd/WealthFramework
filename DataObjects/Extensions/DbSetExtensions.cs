namespace forCrowd.WealthEconomy.DataObjects.Extensions
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;

    public static class DbSetExtensions
    {
        #region All records including deleted

        public static IQueryable<TEntity> GetAll<TEntity>(this DbSet<TEntity> dbSet) where TEntity : class
        {
            return GetAll(dbSet, null, null);
        }

        public static IQueryable<TEntity> GetAll<TEntity>(this DbSet<TEntity> dbSet, Expression<Func<TEntity, bool>> predicate) where TEntity : class
        {
            return GetAll(dbSet, predicate, null);
        }

        public static IQueryable<TEntity> GetAll<TEntity>(this DbSet<TEntity> dbSet, Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties) where TEntity : class
        {
            // Base
            IQueryable<TEntity> query = dbSet;

            // Where
            if (predicate != null)
                query = query.Where(predicate);

            // Including
            if (includeProperties != null)
                foreach (var includeProperty in includeProperties)
                    query = query.Include(includeProperty);

            // Return
            return query;
        }

        #endregion

        #region All records except deleted ones

        public static IQueryable<TEntity> Get<TEntity>(this DbSet<TEntity> dbSet) where TEntity : class, IEntity
        {
            return Get(dbSet, null, null);
        }

        public static IQueryable<TEntity> Get<TEntity>(this DbSet<TEntity> dbSet, Expression<Func<TEntity, bool>> predicate) where TEntity : class, IEntity
        {
            return Get(dbSet, predicate, null);
        }

        public static IQueryable<TEntity> Get<TEntity>(this DbSet<TEntity> dbSet, Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties) where TEntity : class, IEntity
        {
            // Base: GetAll
            var query = GetAll(dbSet, predicate, includeProperties);

            // Filter deleted records
            query = query.Where(entity => !entity.DeletedOn.HasValue);

            // Return
            return query;
        }

#endregion

        //public bool Exists(params object[] keyValues)
        //{
        //    return Find(keyValues) != null;
        //}

        //public override TEntity Add(TEntity entity)
        //{
        //    entity.CreatedOn = DateTime.UtcNow;
        //    entity.ModifiedOn = DateTime.UtcNow;
        //    return base.Add(entity);
        //}

        //public override IEnumerable<TEntity> AddRange(IEnumerable<TEntity> entities)
        //{
        //    foreach (var entity in entities)
        //    {
        //        entity.CreatedOn = DateTime.UtcNow;
        //        entity.ModifiedOn = DateTime.UtcNow;
        //    }
        //    return base.AddRange(entities);
        //}

        //public void Update(TEntity entity)
        //{
        //    entity.ModifiedOn = DateTime.UtcNow;
        //}

        //public void Delete(params object[] keyValues)
        //{
        //    var entity = dbSet.Find(keyValues);
        //    dbSet.Remove(entity);
        //}
    }
}
