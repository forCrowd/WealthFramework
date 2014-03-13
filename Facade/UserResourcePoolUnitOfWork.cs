namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class UserResourcePoolUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        UserResourcePoolRepository userResourcePoolRepository;
        UserRepository userRepository;
        ResourcePoolRepository resourcePoolRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        public UserResourcePoolUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(context)); }
        }

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(context)); }
        }

        #endregion

        public IQueryable<UserResourcePool> All { get { return UserResourcePoolRepository.All; } }

        public IQueryable<UserResourcePool> AllLive { get { return UserResourcePoolRepository.AllLive; } }

        public IQueryable<UserResourcePool> AllIncluding(params Expression<Func<UserResourcePool, object>>[] includeProperties)
        {
            return UserResourcePoolRepository.AllIncluding(includeProperties);
        }

        public IQueryable<UserResourcePool> AllLiveIncluding(params Expression<Func<UserResourcePool, object>>[] includeProperties)
        {
            return UserResourcePoolRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<User> AllUserLive { get { return UserRepository.AllLive; } }

        public IQueryable<ResourcePool> AllResourcePoolLive { get { return ResourcePoolRepository.AllLive; } }

        public UserResourcePool Find(object id)
        {
            return UserResourcePoolRepository.Find(id);
        }

        public async Task<UserResourcePool> FindAsync(object id)
        {
            return await UserResourcePoolRepository.FindAsync(id);
        }

        public async Task<User> FindUserAsync(object id)
        {
            return await UserRepository.FindAsync(id);
        }

        public void InsertOrUpdate(UserResourcePoolDto userResourcePoolDto)
        {
            // TODO Validation?
            InsertOrUpdate(userResourcePoolDto.ToBusinessObject());
        }

        public void InsertOrUpdate(UserResourcePool user)
        {
            // TODO Validation?
            UserResourcePoolRepository.InsertOrUpdate(user);
        }

        public void InsertOrUpdateUserResourcePoolOrganization(UserResourcePoolOrganization userResourcePoolOrganization)
        {
            // TODO Validation?
            UserResourcePoolOrganizationRepository.InsertOrUpdate(userResourcePoolOrganization);
        }

        public void Delete(object id)
        {
            var userResourcePool = Find(id);

            UserResourcePoolOrganizationRepository.DeleteRange(userResourcePool.UserResourcePoolOrganizationSet);
            UserResourcePoolRepository.Delete(id);
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await context.SaveChangesAsync();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
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