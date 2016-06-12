using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class UserResourcePoolTests
    {
        [TestMethod]
        public void NewUserResourcePool_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            var resourcePool = new ResourcePool(user, "CMRP")
                .AddUserResourcePool(0);
        }
    }
}
