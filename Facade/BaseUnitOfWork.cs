namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public abstract class BaseUnitOfWork<TEntityType> : IDisposable where TEntityType : class, IEntity
    {
        public BaseUnitOfWork()
        {
            Context = new WealthEconomyContext();
            MainRepository = new BaseRepository<TEntityType>(Context);
        }

        protected WealthEconomyContext Context { get; private set; }

        protected IGenericRepository<TEntityType> MainRepository { get; private set; }

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

        public bool Exists(params object[] keyValues)
        {
            return MainRepository.Exists(keyValues);
        }

        public virtual void Insert(TEntityType entity)
        {
            MainRepository.Insert(entity);
        }

        public virtual void Update(TEntityType entity)
        {
            MainRepository.Update(entity);
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