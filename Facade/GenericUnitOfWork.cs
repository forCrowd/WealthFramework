//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System;
//    using System.Linq;
//    using System.Linq.Expressions;

//    /// <summary>
//    /// Abstract class for all the unit of work classes (facades).
//    /// </summary>
//    /// <typeparam name="TBusinessObject">Generic type representing the business object.</typeparam>	
//    public class GenericUnitOfWork<T> : IDisposable
//    {
//        WealthEconomyEntities context = new WealthEconomyEntities();
//        IGenericRepository<T> genericRepository;

//        protected GenericUnitOfWork()
//        {
//            context = new WealthEconomyEntities();
//        }

//        protected WealthEconomyEntities Context
//        {
//            get { return context; }
//        }

//        public void Save()
//        {
//            context.SaveChanges();
//        }

//        private bool disposed = false;

//        protected virtual void Dispose(bool disposing)
//        {
//            if (!this.disposed)
//            {
//                if (disposing)
//                {
//                    context.Dispose();
//                }
//            }
//            this.disposed = true;
//        }

//        public void Dispose()
//        {
//            Dispose(true);
//            GC.SuppressFinalize(this);
//        }
//    }
//}
