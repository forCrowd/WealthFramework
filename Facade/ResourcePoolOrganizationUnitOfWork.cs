namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ResourcePoolOrganizationUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        ResourcePoolOrganizationRepository resourcePoolOrganizationRepository;
        ResourcePoolRepository resourcePoolRepository;
        OrganizationRepository organizationRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        public ResourcePoolOrganizationUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        ResourcePoolOrganizationRepository ResourcePoolOrganizationRepository
        {
            get { return resourcePoolOrganizationRepository ?? (resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(context)); }
        }

        OrganizationRepository OrganizationRepository
        {
            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(context)); }
        }

        #endregion

        public IQueryable<ResourcePoolOrganization> All { get { return ResourcePoolOrganizationRepository.All; } }

        public IQueryable<ResourcePoolOrganization> AllLive { get { return ResourcePoolOrganizationRepository.AllLive; } }

        public IQueryable<ResourcePoolOrganization> AllIncluding(params Expression<Func<ResourcePoolOrganization, object>>[] includeProperties)
        {
            return ResourcePoolOrganizationRepository.AllIncluding(includeProperties);
        }

        public IQueryable<ResourcePoolOrganization> AllLiveIncluding(params Expression<Func<ResourcePoolOrganization, object>>[] includeProperties)
        {
            return ResourcePoolOrganizationRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<ResourcePool> AllResourcePoolLive { get { return ResourcePoolRepository.AllLive; } }

        public IQueryable<Organization> AllOrganizationLive { get { return OrganizationRepository.AllLive; } }

        public ResourcePoolOrganization Find(object id)
        {
            return ResourcePoolOrganizationRepository.Find(id);
        }

        public async Task<ResourcePoolOrganization> FindAsync(object id)
        {
            return await ResourcePoolOrganizationRepository.FindAsync(id);
        }

        public void InsertOrUpdate(ResourcePoolOrganizationDto resourcePoolOrganizationDto)
        {
            // TODO Validation?
            InsertOrUpdate(resourcePoolOrganizationDto.ToBusinessObject());
        }

        public void InsertOrUpdate(ResourcePoolOrganization resourcePoolOrganization)
        {
            // TODO Validation?
            ResourcePoolOrganizationRepository.InsertOrUpdate(resourcePoolOrganization);
        }

        public void Delete(object id)
        {
            var resourceOrganization = Find(id);

            UserResourcePoolOrganizationRepository.DeleteRange(resourceOrganization.UserResourcePoolOrganizationSet);
            ResourcePoolOrganizationRepository.Delete(id);
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