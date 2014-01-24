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
	public class OrganizationUnitOfWork : IDisposable
	{
        WealthEconomyEntities context;
        OrganizationRepository organizationRepository;

        OrganizationUnitOfWork()
        {
            context = new WealthEconomyEntities();
        }

        public OrganizationRepository OrganizationRepository
        {
            get
            {
                if (organizationRepository == null)
                    organizationRepository = new OrganizationRepository(context);
                return organizationRepository;
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
