namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolUnitOfWork
    {
        ResourcePoolIndexRepository resourcePoolIndexRepository;
        SectorRepository sectorRepository;
        LicenseRepository licenseRepository;
        OrganizationRepository organizationRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserResourcePoolIndexRepository userResourcePoolIndexRepository;
        UserSectorRatingRepository userSectorRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;

        public ResourcePoolIndexRepository ResourcePoolIndexRepository
        {
            get { return resourcePoolIndexRepository ?? (resourcePoolIndexRepository = new ResourcePoolIndexRepository(Context)); }
        }

        public SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }
        public LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }
        public OrganizationRepository OrganizationRepository
        {
            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        UserResourcePoolIndexRepository UserResourcePoolIndexRepository
        {
            get { return userResourcePoolIndexRepository ?? (userResourcePoolIndexRepository = new UserResourcePoolIndexRepository(Context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(Context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
        }

        UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        public async Task<int> InsertAsync(ResourcePool entity, int userId)
        {
            // Sample resource pool could only be created during DatabaseInitialization at the moment
            entity.IsSample = false;

            // Sample records
            // TODO Enable this block in case if there will no static indexes left in the system
            //var sampleResourcePoolIndex = new ResourcePoolIndex()
            //{
            //    ResourcePool = entity,
            //    Name = "Generic Index"
            //};
            //ResourcePoolIndexRepository.Insert(sampleResourcePoolIndex);

            var sampleSector = new Sector()
            {
                ResourcePool = entity,
                Name = "Generic Sector"
            };
            SectorRepository.Insert(sampleSector);

            var sampleLicense = new License()
            {
                ResourcePool = entity,
                Name = "Generic License",
                Text = "Generic License Text"
            };
            LicenseRepository.Insert(sampleLicense);

            var sampleOrganization = new Organization()
            {
                Sector = sampleSector,
                Name = "Generic Organization",
                ProductionCost = 0,
                SalesPrice = 0,
                License = sampleLicense
            };
            OrganizationRepository.Insert(sampleOrganization);

            CreateUserResourcePool(entity, userId);

            return await base.InsertAsync(entity);
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            var resourcePoolId = (int)id[0];

            // Load the resource pool into the context with its child items, otherwise it fails to delete due to Foreign Key exception
            var resourcePool = AllLiveIncluding(item => item.SectorSet, item => item.LicenseSet)
                .SingleOrDefault(item => item.Id == resourcePoolId);

            if (resourcePool == null)
                return 0;

            return await base.DeleteAsync(resourcePoolId);
        }

        #region - Private Methods - 

        void CreateUserResourcePool(ResourcePool resourcePool, int userId)
        {
            var userResourcePool = new UserResourcePool()
            {
                UserId = userId,
                ResourcePool = resourcePool,
                ResourcePoolRate = 101,
                SectorIndexRating = 0,
                KnowledgeIndexRating = 0,
                TotalCostIndexRating = 0,
                QualityIndexRating = 0,
                EmployeeSatisfactionIndexRating = 0,
                CustomerSatisfactionIndexRating = 0
            };
            UserResourcePoolRepository.Insert(userResourcePool);

            // Sample ratings
            // TODO This is not going to work for now, because there is no ResourcePoolIndex records (it doesn't add a sample index)
            var resourcePoolIndexes = resourcePool.ResourcePoolIndexSet;
            foreach (var resourcePoolIndex in resourcePoolIndexes)
            {
                var sampleUserResourcePoolIndex = new UserResourcePoolIndex()
                {
                    UserResourcePool = userResourcePool,
                    ResourcePoolIndex = resourcePoolIndex,
                    Rating = 50 // TODO Is it correct? Or should be null?
                };
                UserResourcePoolIndexRepository.Insert(sampleUserResourcePoolIndex);
            }

            var sectors = resourcePool.SectorSet;
            foreach (var sector in sectors)
            {
                var sampleUserSectorRating = new UserSectorRating()
                {
                    UserId = userResourcePool.UserId,
                    Sector = sector,
                    Rating = 0
                };
                UserSectorRatingRepository.Insert(sampleUserSectorRating);

                var organizations = sector.OrganizationSet;
                foreach (var organization in organizations)
                {
                    var sampleUserOrganization = new UserOrganization()
                    {
                        UserId = userResourcePool.UserId,
                        Organization = organization,
                        NumberOfSales = 0,
                        QualityRating = 0,
                        CustomerSatisfactionRating = 0,
                        EmployeeSatisfactionRating = 0
                    };
                    UserOrganizationRepository.Insert(sampleUserOrganization);
                }
            }

            var licences = resourcePool.LicenseSet;
            foreach (var license in licences)
            {
                var sampleLicenseRating = new UserLicenseRating()
                {
                    UserId = userResourcePool.UserId,
                    License = license,
                    Rating = 0
                };
                UserLicenseRatingRepository.Insert(sampleLicenseRating);
            }
        }

        #endregion
    }
}