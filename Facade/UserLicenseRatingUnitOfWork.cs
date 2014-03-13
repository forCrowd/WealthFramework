namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class UserLicenseRatingUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserRepository userRepository;
        LicenseRepository licenseRepository;

        public UserLicenseRatingUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(context)); }
        }

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(context)); }
        }

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(context)); }
        }

        #endregion

        public IQueryable<UserLicenseRating> All { get { return UserLicenseRatingRepository.All; } }

        public IQueryable<UserLicenseRating> AllLive { get { return UserLicenseRatingRepository.AllLive; } }

        public IQueryable<UserLicenseRating> AllIncluding(params Expression<Func<UserLicenseRating, object>>[] includeProperties)
        {
            return UserLicenseRatingRepository.AllIncluding(includeProperties);
        }

        public IQueryable<UserLicenseRating> AllLiveIncluding(params Expression<Func<UserLicenseRating, object>>[] includeProperties)
        {
            return UserLicenseRatingRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<User> AllUserLive { get { return UserRepository.AllLive; } }

        public IQueryable<License> AllLicenseLive { get { return LicenseRepository.AllLive; } }

        public UserLicenseRating Find(object id)
        {
            return UserLicenseRatingRepository.Find(id);
        }

        public async Task<UserLicenseRating> FindAsync(object id)
        {
            return await UserLicenseRatingRepository.FindAsync(id);
        }

        public void InsertOrUpdate(UserLicenseRatingDto userLicenseRatingDto)
        {
            // TODO Validation?
            InsertOrUpdate(userLicenseRatingDto.ToBusinessObject());
        }

        public void InsertOrUpdate(UserLicenseRating user)
        {
            // TODO Validation?
            UserLicenseRatingRepository.InsertOrUpdate(user);
        }

        public void Delete(object id)
        {
            UserLicenseRatingRepository.Delete(id);
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