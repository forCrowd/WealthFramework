using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserResourcePoolIndexTests
    {
        [TestMethod]
        public void NewUserResourcePoolIndexShouldCreate()
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

            var newUserResourcePoolIndex = new UserResourcePoolIndex(
                new UserResourcePool(
                    new User("email"),
                    newResourcePool,
                    0),
                    newResourcePoolIndex,
                    0);
        }
    }
}
