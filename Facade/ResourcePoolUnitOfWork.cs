namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;

    public partial class ResourcePoolUnitOfWork
    {
        SectorRepository sectorRepository;
        LicenseRepository licenseRepository;
        OrganizationRepository organizationRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserSectorRatingRepository userSectorRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;

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

        public void Insert(ResourcePool entity, int userId)
        {
            base.Insert(entity);

            // Sample records
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

            Save();
        }

        public override void Delete(params object[] id)
        {
            var resourcePoolId = (int)id[0];

            // Load the resource pool into the context with its child items, otherwise it fails to delete due to Foreign Key exception
            var resourcePool = AllLiveIncluding(item => item.SectorSet, item => item.LicenseSet)
                .SingleOrDefault(item => item.Id == resourcePoolId);

            if (resourcePool == null)
                return;

            base.Delete(resourcePoolId);
        }

        #region - Private Methods - 

        void CreateUserResourcePool(ResourcePool resourcePool, int userId)
        {
            var userResourcePool = new UserResourcePool()
            {
                UserId = userId,
                ResourcePool = resourcePool,
                ResourcePoolRate = 101,
                TotalCostIndexRating = 0,
                KnowledgeIndexRating = 0,
                QualityIndexRating = 0,
                SectorIndexRating = 0,
                EmployeeSatisfactionIndexRating = 0,
                CustomerSatisfactionIndexRating = 0,
                DistanceIndexRating = 0
            };
            UserResourcePoolRepository.Insert(userResourcePool);

            // Sample ratings
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