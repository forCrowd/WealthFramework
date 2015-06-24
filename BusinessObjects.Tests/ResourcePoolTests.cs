using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ResourcePoolTests
    {
        [TestMethod]
        public void NewResourcePool_ShouldCreate()
        {
            // Arrange + act
            var user = new User("User");
            new ResourcePool(user, "Default");
        }
    }
}
