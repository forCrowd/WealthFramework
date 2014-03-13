namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ResourcePoolUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        ResourcePoolRepository resourcePoolRepository;
        ResourcePoolOrganizationRepository resourcePoolOrganizationRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        public ResourcePoolUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(context)); }
        }

        ResourcePoolOrganizationRepository ResourcePoolOrganizationRepository
        {
            get { return resourcePoolOrganizationRepository ?? (resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(context)); }
        }

        #endregion

        public IQueryable<ResourcePool> All { get { return ResourcePoolRepository.All; } }

        public IQueryable<ResourcePool> AllLive { get { return ResourcePoolRepository.AllLive; } }

        public IQueryable<ResourcePool> AllIncluding(params Expression<Func<ResourcePool, object>>[] includeProperties)
        {
            return ResourcePoolRepository.AllIncluding(includeProperties);
        }

        public IQueryable<ResourcePool> AllLiveIncluding(params Expression<Func<ResourcePool, object>>[] includeProperties)
        {
            return ResourcePoolRepository.AllLiveIncluding(includeProperties);
        }

        public ResourcePool Find(object id)
        {
            return ResourcePoolRepository.Find(id);
        }

        public async Task<ResourcePool> FindAsync(object id)
        {
            return await ResourcePoolRepository.FindAsync(id);
        }

        public void InsertOrUpdate(ResourcePoolDto resourcePoolDto)
        {
            // TODO Validation?
            InsertOrUpdate(resourcePoolDto.ToBusinessObject());
        }

        public void InsertOrUpdate(ResourcePool resourcePool)
        {
            // TODO Validation?
            ResourcePoolRepository.InsertOrUpdate(resourcePool);
        }

        public void Delete(object id)
        {
            var resourcePool = Find(id);

            var resourceOrganizationSet = resourcePool.ResourcePoolOrganizationSet;
            foreach (var item in resourceOrganizationSet)
                UserResourcePoolOrganizationRepository.DeleteRange(item.UserResourcePoolOrganizationSet);
            ResourcePoolOrganizationRepository.DeleteRange(resourceOrganizationSet);
            ResourcePoolRepository.Delete(id);
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