namespace Facade.Tests
{
    using BusinessObjects;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    // Update these tests with UserManager?
    [TestClass]
    public class UserUnitOfWorkTest
    {
        [TestMethod]
        public void Select()
        {
            using (var unitOfWork = new UserUnitOfWork())
            {
                var users = unitOfWork.AllLive.AsEnumerable();
            }
        }

        [TestMethod]
        public void Insert()
        {
            using (var unitOfWork = new UserUnitOfWork())
            {
                var user = new User()
                {
                    Email = string.Format("user_{0:yyyyMMdd_HHmmss}", DateTime.Now),
                };

                unitOfWork.Insert(user);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Update()
        {
            using (var unitOfWork = new UserUnitOfWork())
            {
                var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                user.Notes += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

                unitOfWork.Update(user);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Delete()
        {
            using (var unitOfWork = new UserUnitOfWork())
            {
                var user = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

                unitOfWork.Delete(user.Id);
                unitOfWork.Save();
            }
        }
    }
}
