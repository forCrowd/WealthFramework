using System;
using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldIndexTests
    {
        [TestMethod]
        public void NewElementFieldIndex_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.Decimal, true)
                .EnableIndex();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullOrDefaultException))]
        public void NewElementFieldIndexWithInvalidConstructor_Exception()
        {
            var user = new User("User", "user@email.com");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.String)
                .EnableIndex();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void NewElementFieldIndexOnStringType_Exception()
        {
            var user = new User("User", "email@user.com");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.String)
                .EnableIndex();
        }
    }
}
