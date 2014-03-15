namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;

    public partial class UserSectorRatingUnitOfWork
    {
        UserRepository userRepository;
        SectorRepository sectorRepository;

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(Context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        public IQueryable<User> UserSetLive { get { return UserRepository.AllLive; } }

        public IQueryable<Sector> SectorSetLive { get { return SectorRepository.AllLive; } }
    }
}