using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserResourcePoolTests
    {
        [TestMethod]
        public void NewUserResourcePool_ShouldCreate()
        {
            var newUser = new User("Email");

            var newResourcePool = new ResourcePool("CMRP")
                .AddUserResourcePool(newUser, 0);
        }
    }
}
