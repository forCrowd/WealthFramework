namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserUnitOfWork
    {
        LicenseRepository licenseRepository;
        ResourcePoolRepository resourcePoolRepository;
        SectorRepository sectorRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;
        UserSectorRatingRepository userSectorRatingRepository;

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(Context)); }
        }

        public override void Insert(User user)
        {
            // TODO Validation?
            base.Insert(user);

            // Add samples
            // Sample user resource pool
            // TODO Static Id 8 ?!
            var sampleResourcePools = ResourcePoolRepository.AllLive.Where(resourcePool => resourcePool.Id <= 8);

            foreach (var resourcePool in sampleResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    User = user,
                    ResourcePool = resourcePool,
                    ResourcePoolRate = 0,
                    TotalCostIndexRating = resourcePool.Id == 1 ? 100 : 0,
                    KnowledgeIndexRating = resourcePool.Id == 2 ? 100 : 0,
                    QualityIndexRating = resourcePool.Id == 3 ? 100 : 0,
                    SectorIndexRating = resourcePool.Id == 4 ? 100 : 0,
                    EmployeeSatisfactionIndexRating = resourcePool.Id == 5 ? 100 : 0,
                    CustomerSatisfactionIndexRating = resourcePool.Id == 6 ? 100 : 0,
                    DistanceIndexRating = resourcePool.Id == 7 ? 100 : 0,
                };

                UserResourcePoolRepository.Insert(userResourcePool);

                // Sample resource pool organizations
                var sampleResourcePoolOrganizations = resourcePool.ResourcePoolOrganizationSet;

                foreach (var resourcePoolOrganization in sampleResourcePoolOrganizations)
                {
                    var userResourcePoolOrganization = new UserResourcePoolOrganization()
                    {
                        User = user,
                        ResourcePoolOrganization = resourcePoolOrganization,
                        NumberOfSales = 0,
                        // TODO Handle these sample ratings nicely ?!
                        QualityRating = resourcePoolOrganization.OrganizationId == 6 ? 80 : resourcePoolOrganization.OrganizationId == 7 ? 20 : 0,
                        CustomerSatisfactionRating = resourcePoolOrganization.OrganizationId == 8 ? 80 : resourcePoolOrganization.OrganizationId == 9 ? 20 : 0,
                        EmployeeSatisfactionRating = resourcePoolOrganization.OrganizationId == 10 ? 80 : resourcePoolOrganization.OrganizationId == 11 ? 20 : 0,
                    };

                    UserResourcePoolOrganizationRepository.Insert(userResourcePoolOrganization);
                }
            }

            // Sample license ratings
            var licenseSet = LicenseRepository.AllLive;
            foreach (var license in licenseSet)
            {
                var licenceRating = new UserLicenseRating() { User = user, License = license, Rating = 0 };
                UserLicenseRatingRepository.Insert(licenceRating);
            }

            // Sample sector ratings
            var sectorSet = SectorRepository.AllLive;
            foreach (var sector in sectorSet)
            {
                var sectorRating = new UserSectorRating() { User = user, Sector = sector, Rating = 0 };
                UserSectorRatingRepository.Insert(sectorRating);
            }
        }

        public override void Delete(params object[] id)
        {
            var user = Find(id);

            UserLicenseRatingRepository.DeleteRange(user.UserLicenseRatingSet);
            UserResourcePoolOrganizationRepository.DeleteRange(user.UserResourcePoolOrganizationSet);
            UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
            UserSectorRatingRepository.DeleteRange(user.UserSectorRatingSet);

            base.Delete(id);
        }

        public async Task<bool> AuthenticateUser(int userId, string password)
        {
            var selectedUser = await FindAsync(userId);

            if (selectedUser == null)
                return false;

            if (string.IsNullOrWhiteSpace(password))
                return false;

            if (selectedUser.Password != password)
                return false;

            return true;
        }
    }
}