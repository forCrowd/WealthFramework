namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;

    public partial class UserResourcePoolUnitOfWork
    {
        ResourcePoolRepository resourcePoolRepository;
        UserSectorRatingRepository userSectorRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
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

        enum UpdateNumberOfSalesActions
        {
            Increase,
            Decrease,
            Reset
        }

        public override void Insert(UserResourcePool userResourcePool)
        {
            base.Insert(userResourcePool);

            // TODO This is only for temporary, try to find a way to handle these cases better!
            // Currently it's not certain that userResourcePool.ResourcePool property has a value but ResourcePoolId definitely filled.. ?!
            var resourcePool = ResourcePoolRepository.Find(userResourcePool.ResourcePoolId);

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

        public void IncreaseNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Increase);
        }

        public void DecreaseNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Decrease);
        }

        public void ResetNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Reset);
        }

        void UpdateNumberOfSales(UserResourcePool userResourcePool, UpdateNumberOfSalesActions action)
        {
            foreach (var organization in userResourcePool.UserOrganizationSet)
            {
                switch (action)
                {
                    case UpdateNumberOfSalesActions.Increase:
                        organization.NumberOfSales++;
                        break;
                    case UpdateNumberOfSalesActions.Decrease:
                        organization.NumberOfSales--;
                        break;
                    case UpdateNumberOfSalesActions.Reset:
                        organization.NumberOfSales = 0;
                        break;
                }
                UserOrganizationRepository.Update(organization);
            }
        }

        public override void Delete(params object[] id)
        {
            // TODO How about retrieving it by using Include?
            var userResourcePool = Find(id);

            // Delete child items first
            UserOrganizationRepository.DeleteRange(userResourcePool.UserOrganizationSet);

            var userSectorRatings = userResourcePool
                .User
                .UserSectorRatingSet
                .Where(item => userResourcePool
                    .ResourcePool
                    .SectorSet
                    .Any(sector => sector == item.Sector));
            UserSectorRatingRepository.DeleteRange(userSectorRatings);

            var userLicenseRatings = userResourcePool
                .User
                .UserLicenseRatingSet
                .Where(item => userResourcePool
                    .ResourcePool
                    .LicenseSet
                    .Any(license => license == item.License));
            UserLicenseRatingRepository.DeleteRange(userLicenseRatings);

            // Delete main item
            base.Delete(id);
        }
    }
}