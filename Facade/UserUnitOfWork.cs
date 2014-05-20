namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserUnitOfWork
    {
        ResourcePoolRepository resourcePoolRepository;
        SectorRepository sectorRepository;
        LicenseRepository licenseRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserSectorRatingRepository userSectorRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
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

        public override async Task<int> InsertAsync(User user)
        {
            // Add sample data to the user

            // TODO Static?
            const int sampleUserId = 1;
            const int maxSampleResourcePoolId = 8;

            // User resource pools
            var sampleUserResourcePools = UserResourcePoolRepository
                .AllLive
                .Include(item => item.ResourcePool)
                .Where(item => item.UserId == sampleUserId && item.ResourcePoolId <= maxSampleResourcePoolId);

            foreach (var sampleUserResourcePool in sampleUserResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    User = user,
                    ResourcePool = sampleUserResourcePool.ResourcePool,
                    ResourcePoolRate = sampleUserResourcePool.ResourcePoolRate,
                    TotalCostIndexRating = sampleUserResourcePool.TotalCostIndexRating,
                    KnowledgeIndexRating = sampleUserResourcePool.KnowledgeIndexRating,
                    QualityIndexRating = sampleUserResourcePool.QualityIndexRating,
                    SectorIndexRating = sampleUserResourcePool.SectorIndexRating,
                    EmployeeSatisfactionIndexRating = sampleUserResourcePool.EmployeeSatisfactionIndexRating,
                    CustomerSatisfactionIndexRating = sampleUserResourcePool.CustomerSatisfactionIndexRating,
                    DistanceIndexRating = sampleUserResourcePool.DistanceIndexRating,
                };
                UserResourcePoolRepository.Insert(userResourcePool);
            }

            // User sector ratings
            var sampleSectorRatings = UserSectorRatingRepository
                .AllLive
                .Include(item => item.Sector)
                .Where(item => item.UserId == sampleUserId && item.Sector.ResourcePoolId <= maxSampleResourcePoolId);

            foreach (var sampleSectorRating in sampleSectorRatings)
            {
                var userSectorRating = new UserSectorRating()
                {
                    User = user,
                    Sector = sampleSectorRating.Sector,
                    Rating = sampleSectorRating.Rating
                };
                UserSectorRatingRepository.Insert(userSectorRating);
            }

            // User license ratings
            var sampleLicenseRatings = UserLicenseRatingRepository
                .AllLive
                .Include(item => item.License)
                .Where(item => item.UserId == sampleUserId && item.License.ResourcePoolId <= maxSampleResourcePoolId);
            
            foreach (var sampleLicenseRating in sampleLicenseRatings)
            {
                var userLicenceRating = new UserLicenseRating()
                {
                    User = user,
                    License = sampleLicenseRating.License,
                    Rating = sampleLicenseRating.Rating
                };
                UserLicenseRatingRepository.Insert(userLicenceRating);
            }

            // User organizations
            var sampleOrganizations = UserOrganizationRepository
                .AllLive
                .Include(item => item.Organization)
                .Where(item => item.UserId == sampleUserId && item.Organization.Sector.ResourcePoolId <= maxSampleResourcePoolId);

            foreach (var sampleOrganization in sampleOrganizations)
            {
                var userOrganization = new UserOrganization()
                {
                    User = user,
                    Organization = sampleOrganization.Organization,
                    NumberOfSales = sampleOrganization.NumberOfSales,
                    QualityRating = sampleOrganization.QualityRating,
                    CustomerSatisfactionRating = sampleOrganization.CustomerSatisfactionRating,
                    EmployeeSatisfactionRating = sampleOrganization.EmployeeSatisfactionRating
                };
                UserOrganizationRepository.Insert(userOrganization);
            }

            return await base.InsertAsync(user);
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            var user = Find(id);

            UserLicenseRatingRepository.DeleteRange(user.UserLicenseRatingSet);
            UserOrganizationRepository.DeleteRange(user.UserOrganizationSet);
            UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
            UserSectorRatingRepository.DeleteRange(user.UserSectorRatingSet);

            return await base.DeleteAsync(id);
        }
    }
}