namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class BaseUnitOfWork<TEntityType> : IDisposable where TEntityType : class, IEntity
    {
        WealthEconomyEntities context;
        IGenericRepository<TEntityType> mainRepository;

        protected BaseUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        protected WealthEconomyEntities Context
        {
            get { return context; }
        }

        protected IGenericRepository<TEntityType> MainRepository
        {
            get {  return mainRepository ?? (mainRepository = new BaseRepository<TEntityType>(Context)); }
        }

        public IQueryable<TEntityType> All { get { return MainRepository.All; } }

        public IQueryable<TEntityType> AllLive { get { return MainRepository.AllLive; } }

        public IQueryable<TEntityType> AllIncluding(params Expression<Func<TEntityType, object>>[] includeProperties)
        {
            return MainRepository.AllIncluding(includeProperties);
        }

        public IQueryable<TEntityType> AllLiveIncluding(params Expression<Func<TEntityType, object>>[] includeProperties)
        {
            return MainRepository.AllLiveIncluding(includeProperties);
        }

        public TEntityType Find(params object[] keyValues)
        {
            return MainRepository.Find(keyValues);
        }

        public async Task<TEntityType> FindAsync(params object[] keyValues)
        {
            return await MainRepository.FindAsync(keyValues);
        }

        public virtual void InsertOrUpdate(TEntityType entity)
        {
            MainRepository.InsertOrUpdate(entity);
        }

        public virtual void Delete(params object[] keyValues)
        {
            MainRepository.Delete(keyValues);
        }

        public int Save()
        {
            return Context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await Context.SaveChangesAsync();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    Context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}