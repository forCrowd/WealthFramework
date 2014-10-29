//namespace Facade.Tests
//{
//    using BusinessObjects;
//    using Facade;
//    using Microsoft.VisualStudio.TestTools.UnitTesting;
//    using System;
//    using System.Linq;

//    // Update these tests with UserManager?
//    [TestClass]
//    public class UserUnitOfWorkTest
//    {
//        const int sampleUserId = 2;

//        [TestMethod]
//        [Obsolete("Needs to be integrated with AspNetUserManager")]
//        public void Select()
//        {
//            using (var unitOfWork = new UserUnitOfWork())
//            {
//                var users = unitOfWork.AllLive.AsEnumerable();
//            }
//        }

//        [TestMethod]
//        [Obsolete("Needs to be integrated with AspNetUserManager")]
//        public void Insert()
//        {
//            using (var unitOfWork = new UserUnitOfWork())
//            {

//                var user = new User()
//                {
//                    Email = string.Format("user_{0:yyyyMMdd_HHmmss}", DateTime.Now),
//                };

//                unitOfWork.InsertAsync(user, sampleUserId);
//            }
//        }

//        [TestMethod]
//        [Obsolete("Needs to be integrated with AspNetUserManager")]
//        public void Update()
//        {
//            using (var unitOfWork = new UserUnitOfWork())
//            {
//                var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
//                user.Notes += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

//                unitOfWork.UpdateAsync(user);
//            }
//        }

//        [TestMethod]
//        [Obsolete("Needs to be integrated with AspNetUserManager")]
//        public void Delete()
//        {
//            using (var unitOfWork = new UserUnitOfWork())
//            {
//                var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
//                unitOfWork.DeleteAsync(user.Id);
//            }
//        }

//        [TestMethod]
//        public void ResetSampleData()
//        {
//            using (var unitOfWork = new UserUnitOfWork())
//            {
//                var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
//                unitOfWork.ResetSampleDataAsync(user.Id, sampleUserId);
//            }
//        }
//    }
//}
