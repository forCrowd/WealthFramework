namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class LicenseUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        LicenseRepository licenseRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;

        public LicenseUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(context)); }
        }

        #endregion

        public IQueryable<License> All { get { return LicenseRepository.All; } }

        public IQueryable<License> AllLive { get { return LicenseRepository.AllLive; } }

        public IQueryable<License> AllIncluding(params Expression<Func<License, object>>[] includeProperties)
        {
            return LicenseRepository.AllIncluding(includeProperties);
        }

        public IQueryable<License> AllLiveIncluding(params Expression<Func<License, object>>[] includeProperties)
        {
            return LicenseRepository.AllLiveIncluding(includeProperties);
        }

        public License Find(object id)
        {
            return LicenseRepository.Find(id);
        }

        public async Task<License> FindAsync(object id)
        {
            return await LicenseRepository.FindAsync(id);
        }

        public void InsertOrUpdate(LicenseDto licenseDto)
        {
            // TODO Validation?
            InsertOrUpdate(licenseDto.ToBusinessObject());
        }

        public void InsertOrUpdate(License license)
        {
            // TODO Validation?
            LicenseRepository.InsertOrUpdate(license);
        }

        public void Delete(object id)
        {
            var license = Find(id);

            UserLicenseRatingRepository.DeleteRange(license.UserLicenseRatingSet);
            LicenseRepository.Delete(id);
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