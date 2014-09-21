//namespace Facade.Tests
//{
//    using BusinessObjects;
//    using Facade;
//    using Microsoft.VisualStudio.TestTools.UnitTesting;
//    using System;
//    using System.Linq;

//    [TestClass]
//    public class LicenseUnitOfWorkTest
//    {
//        [TestMethod]
//        public void Select()
//        {
//            using (var unitOfWork = new LicenseUnitOfWork())
//            {
//                var licenses = unitOfWork.AllLive;

//                foreach (var item in licenses)
//                {
//                    Console.WriteLine(item.Name);
//                }
//            }
//        }

//        [TestMethod]
//        public void Insert()
//        {
//            ResourcePool sampleResourcePool;
//            using (var unitOfWork = new ResourcePoolUnitOfWork())
//                sampleResourcePool = unitOfWork.AllLive.First();

//            User sampleUser;
//            using (var unitOfWork = new UserUnitOfWork())
//                sampleUser = unitOfWork.AllLive.First();

//            using (var unitOfWork = new LicenseUnitOfWork())
//            {
//                var license = new License()
//                {
//                    ResourcePoolId = sampleResourcePool.Id,
//                    Name = "Test license",
//                    Text = "Test license text"
//                };

//                unitOfWork.InsertAsync(license, sampleUser.Id);
//                //unitOfWork.Save();
//            }
//        }

//        [TestMethod]
//        public void Update()
//        {
//            using (var unitOfWork = new LicenseUnitOfWork())
//            {
//                var license = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
//                license.Description += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

//                unitOfWork.UpdateAsync(license);
//                // unitOfWork.Save();
//            }
//        }

//        [TestMethod]
//        public void Delete()
//        {
//            using (var unitOfWork = new LicenseUnitOfWork())
//            {
//                var license = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

//                unitOfWork.DeleteAsync(license.Id);
//                // unitOfWork.Save();
//            }
//        }
//    }
//}
