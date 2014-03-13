namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class OrganizationUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        OrganizationRepository organizationRepository;
        LicenseRepository licenseRepository;
        SectorRepository sectorRepository;
        ResourcePoolOrganizationRepository resourcePoolOrganizationRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        public OrganizationUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        OrganizationRepository OrganizationRepository
        {
            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(context)); }
        }

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(context)); }
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

        public IQueryable<Organization> All { get { return OrganizationRepository.All; } }

        public IQueryable<Organization> AllLive { get { return OrganizationRepository.AllLive; } }

        public IQueryable<Organization> AllIncluding(params Expression<Func<Organization, object>>[] includeProperties)
        {
            return OrganizationRepository.AllIncluding(includeProperties);
        }

        public IQueryable<Organization> AllLiveIncluding(params Expression<Func<Organization, object>>[] includeProperties)
        {
            return OrganizationRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<License> AllLicenseLive { get { return LicenseRepository.AllLive; } }

        public IQueryable<Sector> AllSectorLive { get { return SectorRepository.AllLive; } }

        public Organization Find(object id)
        {
            return OrganizationRepository.Find(id);
        }
        
        public async Task<Organization> FindAsync(object id)
        {
            return await OrganizationRepository.FindAsync(id);
        }

        public void InsertOrUpdate(OrganizationDto organizationDto)
        {
            // TODO Validation?
            InsertOrUpdate(organizationDto.ToBusinessObject());        
        }

        public void InsertOrUpdate(Organization organization)
        {
            // TODO Validation?
            OrganizationRepository.InsertOrUpdate(organization);
        }

        public void Delete(object id)
        {
            var organization = Find(id);

            var resourceOrganizationSet = organization.ResourcePoolOrganizationSet;
            foreach (var item in resourceOrganizationSet)
                UserResourcePoolOrganizationRepository.DeleteRange(item.UserResourcePoolOrganizationSet);
            ResourcePoolOrganizationRepository.DeleteRange(resourceOrganizationSet);
            OrganizationRepository.Delete(id);
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