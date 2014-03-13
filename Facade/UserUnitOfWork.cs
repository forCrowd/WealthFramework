namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class UserUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        UserRepository userRepository;
        LicenseRepository licenseRepository;
        ResourcePoolRepository resourcePoolRepository;
        SectorRepository sectorRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;
        UserSectorRatingRepository userSectorRatingRepository;

        public UserUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(context)); }
        }

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(context)); }
        }

        #endregion

        public IQueryable<User> All { get { return UserRepository.All; } }

        public IQueryable<User> AllLive { get { return UserRepository.AllLive; } }

        public IQueryable<User> AllIncluding(params Expression<Func<User, object>>[] includeProperties)
        {
            return UserRepository.AllIncluding(includeProperties);
        }

        public IQueryable<User> AllLiveIncluding(params Expression<Func<User, object>>[] includeProperties)
        {
            return UserRepository.AllLiveIncluding(includeProperties);
        }

        public User Find(object id)
        {
            return UserRepository.Find(id);
        }

        public async Task<User> FindAsync(object id)
        {
            return await UserRepository.FindAsync(id);
        }

        public void InsertOrUpdate(UserDto userDto)
        {
            // TODO Validation?
            InsertOrUpdate(userDto.ToBusinessObject());
        }

        public void InsertOrUpdate(User user)
        {
            // TODO Validation?
            if (user.Id == default(int))
            {
                UserRepository.InsertOrUpdate(user);

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

                    UserResourcePoolRepository.InsertOrUpdate(userResourcePool);

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

                        UserResourcePoolOrganizationRepository.InsertOrUpdate(userResourcePoolOrganization);
                    }
                }

                // Sample license ratings
                var licenseSet = LicenseRepository.AllLive;
                foreach (var license in licenseSet)
                {
                    var licenceRating = new UserLicenseRating() { User = user, License = license, Rating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                    UserLicenseRatingRepository.InsertOrUpdate(licenceRating);
                }

                // Sample sector ratings
                var sectorSet = SectorRepository.AllLive;
                foreach (var sector in sectorSet)
                {
                    var sectorRating = new UserSectorRating() { User = user, Sector = sector, Rating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                    UserSectorRatingRepository.InsertOrUpdate(sectorRating);
                }
            }
            else
            {
                UserRepository.InsertOrUpdate(user);
            }
        }

        public void Delete(object id)
        {
            var user = Find(id);

            UserLicenseRatingRepository.DeleteRange(user.UserLicenseRatingSet);
            UserResourcePoolOrganizationRepository.DeleteRange(user.UserResourcePoolOrganizationSet);
            UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
            UserSectorRatingRepository.DeleteRange(user.UserSectorRatingSet);
            UserRepository.Delete(id);
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