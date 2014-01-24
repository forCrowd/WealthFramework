namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

	/// <summary>
	/// Abstract class for all the managers (facades).
	/// </summary>
	/// <typeparam name="TBusinessObject">Generic type representing the business object.</typeparam>	
	public class UserUnitOfWork : IDisposable
	{
        WealthEconomyEntities context;
        UserRepository userRepository;
        UserDistributionIndexRatingRepository userDistributionIndexRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRatingRepository userOrganizationRatingRepository;
        UserSectorRatingRepository userSectorRatingRepository;

        public UserUnitOfWork()
        {
            context = new WealthEconomyEntities();
            userRepository = new UserRepository(context);
            userDistributionIndexRatingRepository = new UserDistributionIndexRatingRepository(context);
            userLicenseRatingRepository = new UserLicenseRatingRepository(context);
            userOrganizationRatingRepository = new UserOrganizationRatingRepository(context);
            userSectorRatingRepository = new UserSectorRatingRepository(context);
        }

        public IQueryable<User> AllLiveUser
        {
            get { return userRepository.AllLive; }
        }

        public User Find(int userId)
        {
            return userRepository.Find(userId);
        }

        public void InsertOrUpdate(User user)
        {
            userRepository.InsertOrUpdate(user);
        }

        public void Delete(int userId)
        {
            userRepository.Delete(userId);
        }

		public void Save()
		{
            context.SaveChanges();
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
