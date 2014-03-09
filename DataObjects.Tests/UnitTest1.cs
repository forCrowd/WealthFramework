using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BusinessObjects;
using DataObjects;

namespace DataObjects.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void NewUser()
        {
            //var user = new Data
            var newUser = new User()
            {
                Email = string.Format("user_{0:yyyyMMdd_HHmmss}@wealtheconomy.com", DateTime.Now),
            };

            var userRepository = new UserRepository(new WealthEconomyEntities());
            userRepository.InsertOrUpdate(newUser);
            userRepository.Save();
        }
    }
}
