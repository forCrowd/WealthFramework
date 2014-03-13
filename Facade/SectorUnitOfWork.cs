namespace Facade
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class SectorUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        SectorRepository sectorRepository;
        UserSectorRatingRepository userSectorRatingRepository;

        public SectorUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        #region - Repositories -

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(context)); }
        }

        #endregion

        public IQueryable<Sector> All { get { return SectorRepository.All; } }

        public IQueryable<Sector> AllLive { get { return SectorRepository.AllLive; } }

        public IQueryable<Sector> AllIncluding(params Expression<Func<Sector, object>>[] includeProperties)
        {
            return SectorRepository.AllIncluding(includeProperties);
        }

        public IQueryable<Sector> AllLiveIncluding(params Expression<Func<Sector, object>>[] includeProperties)
        {
            return SectorRepository.AllLiveIncluding(includeProperties);
        }

        public Sector Find(object id)
        {
            return SectorRepository.Find(id);
        }

        public async Task<Sector> FindAsync(object id)
        {
            return await SectorRepository.FindAsync(id);
        }

        public void InsertOrUpdate(SectorDto sectorDto)
        {
            // TODO Validation?
            InsertOrUpdate(sectorDto.ToBusinessObject());
        }

        public void InsertOrUpdate(Sector sector)
        {
            // TODO Validation?
            SectorRepository.InsertOrUpdate(sector);
        }

        public void Delete(object id)
        {
            var sector = Find(id);

            UserSectorRatingRepository.DeleteRange(sector.UserSectorRatingSet);
            SectorRepository.Delete(id);
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