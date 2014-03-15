namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;

    public partial class UserLicenseRatingUnitOfWork
    {
        UserRepository userRepository;
        LicenseRepository licenseRepository;

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(Context)); }
        }

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }

        public IQueryable<User> UserSetLive { get { return UserRepository.AllLive; } }

        public IQueryable<License> LicenseSetLive { get { return LicenseRepository.AllLive; } }
    }
}