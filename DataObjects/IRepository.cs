namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public interface IRepository<TEntityType> : IDisposable where TEntityType : class, IEntity
    {
        IQueryable<TEntityType> All { get; }

        IQueryable<TEntityType> AllLive { get; }

        IQueryable<TEntityType> AllIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        IQueryable<TEntityType> AllLiveIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        TEntityType Find(params object[] keyValues);

        Task<TEntityType> FindAsync(params object[] keyValues);

        bool Exists(object[] keyValues);

        void Insert(TEntityType entity);

        void Update(TEntityType entity);

        void Delete(params object[] keyValues);

        void DeleteRange(IEnumerable<TEntityType> entities);

        int SaveChanges();

        Task<int> SaveChangesAsync();
    }
}
