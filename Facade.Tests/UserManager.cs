namespace Facade.Tests
{
    using BusinessObjects;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;

    [TestClass]
    public class UserManager
    {
        [TestMethod]
        public void Insert()
        {
            var newUser = new User()
            {
                Email = string.Format("user_{0:yyyyMMdd_HHmmss}", DateTime.Now)
            };

            var unitOfWork = new UserUnitOfWork();
            unitOfWork.InsertOrUpdate(newUser);
            unitOfWork.Save();
        }
    }
}
