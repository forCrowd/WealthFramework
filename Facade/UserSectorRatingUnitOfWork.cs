namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class UserSectorRatingUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        UserSectorRatingRepository userSectorRatingRepository;
        UserRepository userRepository;
        SectorRepository sectorRepository;

        public UserSectorRatingUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(context)); }
        }

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(context)); }
        }

        #endregion

        public IQueryable<UserSectorRating> All { get { return UserSectorRatingRepository.All; } }

        public IQueryable<UserSectorRating> AllLive { get { return UserSectorRatingRepository.AllLive; } }

        public IQueryable<UserSectorRating> AllIncluding(params Expression<Func<UserSectorRating, object>>[] includeProperties)
        {
            return UserSectorRatingRepository.AllIncluding(includeProperties);
        }

        public IQueryable<UserSectorRating> AllLiveIncluding(params Expression<Func<UserSectorRating, object>>[] includeProperties)
        {
            return UserSectorRatingRepository.AllLiveIncluding(includeProperties);
        }

        public IQueryable<User> AllUserLive { get { return UserRepository.AllLive; } }

        public IQueryable<Sector> AllSectorLive { get { return SectorRepository.AllLive; } }

        public UserSectorRating Find(object id)
        {
            return UserSectorRatingRepository.Find(id);
        }

        public async Task<UserSectorRating> FindAsync(object id)
        {
            return await UserSectorRatingRepository.FindAsync(id);
        }

        public void InsertOrUpdate(UserSectorRatingDto userSectorRatingDto)
        {
            // TODO Validation?
            InsertOrUpdate(userSectorRatingDto.ToBusinessObject());
        }

        public void InsertOrUpdate(UserSectorRating user)
        {
            // TODO Validation?
            UserSectorRatingRepository.InsertOrUpdate(user);
        }

        public void Delete(object id)
        {
            UserSectorRatingRepository.Delete(id);
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