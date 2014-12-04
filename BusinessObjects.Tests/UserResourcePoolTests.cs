using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserResourcePoolTests
    {
        [TestMethod]
        public void NewUserResourcePoolShouldCreate()
        {
            var newResourcePool = new ResourcePool("CMRP");
            var newResourcePoolIndex = new ResourcePoolIndex(
                newResourcePool,
                "Default index",
                new ElementField(
                    new Element(new ResourcePool("CMRP"), "Element"),
                    "Field",
                    true,
                    ElementFieldTypes.Boolean));

                new UserResourcePool(
                    new User("email"),
                    newResourcePool,
                    0);
        }
    }
}
