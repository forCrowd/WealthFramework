namespace Facade.Tests
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    [TestClass]
    public class UserUnitOfWorkTest
    {
        [TestMethod]
        public void Insert()
        {
            var unitOfWork = new UserUnitOfWork();

            var user = new User()
            {
                Email = string.Format("user_{0:yyyyMMdd_HHmmss}", DateTime.Now),
                UserAccountTypeId = (byte)UserAccountType.Standard
            };

            unitOfWork.InsertOrUpdate(user);
            unitOfWork.Save();
        }

        [TestMethod]
        public void Update()
        {
            var unitOfWork = new UserUnitOfWork();

            var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
            user.Notes += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

            unitOfWork.InsertOrUpdate(user);
            unitOfWork.Save();
        }

        [TestMethod]
        public void Delete()
        {
            var unitOfWork = new UserUnitOfWork();

            var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

            unitOfWork.Delete(user.Id);
            unitOfWork.Save();
        }
    }
}
