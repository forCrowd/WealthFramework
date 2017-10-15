namespace forCrowd.WealthEconomy.DataObjects
{
    using BusinessObjects;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;

    public static class DbSetExtensions
    {
        public static IQueryable<TEntity> GetAll<TEntity>(this DbSet<TEntity> dbSet, bool liveFilter = true, params Expression<Func<TEntity, object>>[] includeProperties) where TEntity : class, IEntity
        {
            // Base
            var query = dbSet.AsQueryable();

            // Live?
            if (liveFilter)
            {
                query = query.Where(entity => !entity.DeletedOn.HasValue);
            }

            // Including
            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }

            // Return
            return query;
        }
    }
}
