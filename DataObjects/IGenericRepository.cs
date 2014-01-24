namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    public interface IGenericRepository<TEntityType, TPrimaryKeyType> : IDisposable
        where TEntityType : class, IEntity<TPrimaryKeyType>
        where TPrimaryKeyType : struct
    {
        IQueryable<TEntityType> All { get; }

        IQueryable<TEntityType> AllLive { get; }

        IQueryable<TEntityType> AllIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        IQueryable<TEntityType> AllLiveIncluding(params Expression<Func<TEntityType, object>>[] includeProperties);

        TEntityType Find(TPrimaryKeyType id);

        void InsertOrUpdate(TEntityType entity);

        void Delete(TPrimaryKeyType id);

        void Save();
    }
}
