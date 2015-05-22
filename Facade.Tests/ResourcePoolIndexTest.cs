namespace Facade.Tests
{
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    [TestClass]
    public class ElementFieldIndexTest
    {
        //[TestMethod]
        //public void Select()
        //{
        //    using (var unitOfWork = new ElementFieldIndexUnitOfWork())
        //    {
        //        var list = unitOfWork.AllLiveIncluding(item => item.UserElementFieldIndexSet);

        //        var sbOutput = new StringBuilder();

        //        foreach (var item in list)
        //        {
        //            sbOutput.AppendFormat("Name: {0}", item.Name).AppendLine();
        //            sbOutput.AppendFormat("IndexRatingCount: {0}", item.IndexRatingCountOld()).AppendLine();
        //            sbOutput.AppendFormat("IndexRatingAverage: {0}", item.IndexRatingAverageOld()).AppendLine();
        //        }

        //        Console.WriteLine(sbOutput);
        //    }
        //}

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
