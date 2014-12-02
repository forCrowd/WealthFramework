namespace Facade.Tests
{
    using BusinessObjects;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    [TestClass]
    public class ResourcePoolUnitOfWorkTest
    {
        [TestMethod]
        public void Select()
        {
            using (var unitOfWork = new ResourcePoolUnitOfWork())
            {
                var list = unitOfWork.AllLive;

                foreach (var item in list)
                {
                    Console.WriteLine(item.Name);
                }
            }
        }

        //[TestMethod]
        //public void Insert()
        //{
        //    User sampleUser;
        //    using (var unitOfWork = new UserUnitOfWork())
        //        sampleUser = unitOfWork.AllLive.First();

        //    using (var unitOfWork = new ResourcePoolUnitOfWork())
        //    {
        //        var resourcePool = new ResourcePool()
        //        {
        //            Name = "Test Resource Pool"
        //        };

        //        unitOfWork.InsertAsync(resourcePool, sampleUser.Id);
        //    }
        //}

        [TestMethod]
        public void Update()
        {
            using (var unitOfWork = new ResourcePoolUnitOfWork())
            {
                var resourcePool = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                resourcePool.Name += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

                unitOfWork.UpdateAsync(resourcePool);
                //unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Delete()
        {
            using (var unitOfWork = new ResourcePoolUnitOfWork())
            {
                var resourcePool = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                unitOfWork.DeleteAsync(resourcePool.Id);
                //unitOfWork.Save();
            }
        }
    }
}
