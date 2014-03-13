namespace DataObjects
{
    using BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

    public interface IGenericRepository<TEntityType, TPrimaryKeyType> : IDisposable
        where TEntityType : class, IEntity<TPrimaryKeyType>
        where TPrimaryKeyType : struct
    {
        IQueryable<TEntityType> All { get; }

        IQueryable<TEntityType> AllLive { get; }

        IQueryable<TEntityType> AllIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        IQueryable<TEntityType> AllLiveIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        TEntityType Find(object id);

        Task<TEntityType> FindAsync(object id);

        void InsertOrUpdate(TEntityType entity);

        void Delete(object id);

        void DeleteRange(IEnumerable<TEntityType> entities);

        int Save();

        Task<int> SaveAsync();
    }
}
