namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class UserResourcePoolOrganizationUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;
        UserRepository userRepository;
        ResourcePoolOrganizationRepository resourcePoolOrganizationRepository;

        public UserResourcePoolOrganizationUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(context)); }
        }

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(context)); }
        }

        ResourcePoolOrganizationRepository ResourcePoolOrganizationRepository
        {
            get { return resourcePoolOrganizationRepository ?? (resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(context)); }
        }

        #endregion

        public IQueryable<UserResourcePoolOrganization> All { get { return UserResourcePoolOrganizationRepository.All; } }

        public IQueryable<UserResourcePoolOrganization> AllLive { get { return UserResourcePoolOrganizationRepository.AllLive; } }

        public IQueryable<UserResourcePoolOrganization> AllIncluding(params Expression<Func<UserResourcePoolOrganization, object>>[] includeProperties)
        {
            return UserResourcePoolOrganizationRepository.AllIncluding(includeProperties);
        }

        public IQueryable<UserResourcePoolOrganization> AllLiveIncluding(params Expression<Func<UserResourcePoolOrganization, object>>[] includeProperties)
        {
            return UserResourcePoolOrganizationRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<User> AllUserLive { get { return UserRepository.AllLive; } }

        public IQueryable<ResourcePoolOrganization> AllResourcePoolOrganizationLive { get { return ResourcePoolOrganizationRepository.AllLive; } }

        public UserResourcePoolOrganization Find(object id)
        {
            return UserResourcePoolOrganizationRepository.Find(id);
        }

        public async Task<UserResourcePoolOrganization> FindAsync(object id)
        {
            return await UserResourcePoolOrganizationRepository.FindAsync(id);
        }

        public void InsertOrUpdate(UserResourcePoolOrganizationDto userResourcePoolOrganizationDto)
        {
            // TODO Validation?
            InsertOrUpdate(userResourcePoolOrganizationDto.ToBusinessObject());
        }

        public void InsertOrUpdate(UserResourcePoolOrganization user)
        {
            // TODO Validation?
            UserResourcePoolOrganizationRepository.InsertOrUpdate(user);
        }

        public void Delete(object id)
        {
            UserResourcePoolOrganizationRepository.Delete(id);
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