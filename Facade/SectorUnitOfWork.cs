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
	public class SectorUnitOfWork : IDisposable
	{
        WealthEconomyEntities context;
        SectorRepository sectorRepository;

        SectorUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        public SectorRepository SectorRepository
        {
            get
            {
                if (sectorRepository == null)
                    sectorRepository = new SectorRepository(context);
                return sectorRepository;
            }
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
