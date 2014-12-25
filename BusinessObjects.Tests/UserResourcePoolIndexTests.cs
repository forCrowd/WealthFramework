using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserElementFieldIndexTests
    {
        [TestMethod]
        public void NewUserElementFieldIndexShouldCreate()
        {
            var newResourcePool = new ResourcePool("CMRP");
            var newElementFieldIndex = new ElementFieldIndex(
                new ElementField(
                    new Element(new ResourcePool("CMRP"), "Element"),
                    "Field",
                    true,
                    ElementFieldTypes.Boolean),
                "Default index");

            var newUserElementFieldIndex = new UserElementFieldIndex(
                new UserResourcePool(
                    new User("email"),
                    newResourcePool,
                    0),
                    newElementFieldIndex,
                    0);
        }
    }
}
