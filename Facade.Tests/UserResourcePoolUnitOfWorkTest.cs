namespace Facade.Tests
{
    using BusinessObjects;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    [TestClass]
    public class UserResourcePoolUnitOfWorkTest
    {
        [TestMethod]
        public void Select()
        {
            using (var unitOfWork = new UserResourcePoolUnitOfWork())
            {
                var list = unitOfWork.AllLive;

                foreach (var item in list)
                {
                    Console.WriteLine(item.Name);
                }
            }
        }

        [TestMethod]
        public void Insert()
        {
            ResourcePool sampleResourcePool;
            using (var unitOfWork = new ResourcePoolUnitOfWork())
                sampleResourcePool = unitOfWork.AllLive.First();

            User sampleUser;
            using (var unitOfWork = new UserUnitOfWork())
                sampleUser = unitOfWork.AllLive.First();

            using (var unitOfWork = new UserResourcePoolUnitOfWork())
            {
                var existingList = unitOfWork.AllLive.Where(item => item.UserId == sampleUser.Id
                    && item.ResourcePoolId == sampleResourcePool.Id);
                
                foreach (var item in existingList)
                    unitOfWork.DeleteAsync(item.Id);

                var userResourcePool = new UserResourcePool()
                {
                    UserId = sampleUser.Id,
                    ResourcePoolId = sampleResourcePool.Id,
                    ResourcePoolRate = 101,
                    TotalCostIndexRating = 0,
                    KnowledgeIndexRating = 0,
                    QualityIndexRating = 0,
                    SectorIndexRating = 0,
                    EmployeeSatisfactionIndexRating = 0,
                    CustomerSatisfactionIndexRating = 0//,
                    //DistanceIndexRating = 0
                };

                unitOfWork.InsertAsync(userResourcePool);
                //unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Update()
        {
            using (var unitOfWork = new UserResourcePoolUnitOfWork())
            {
                var userResourcePool = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                userResourcePool.ResourcePoolRate = 1;

                unitOfWork.UpdateAsync(userResourcePool);
                //unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Delete()
        {
            using (var unitOfWork = new UserResourcePoolUnitOfWork())
            {
                var userResourcePool = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

                unitOfWork.DeleteAsync(userResourcePool.Id);
                //unitOfWork.Save();
            }
        }
    }
}
