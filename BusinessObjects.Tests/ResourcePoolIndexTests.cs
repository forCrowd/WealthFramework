using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ResourcePoolIndexTests
    {
        [TestMethod]
        public void NewResourcePoolIndexShouldCreate()
        {
            var newResourcePoolIndex = new ResourcePoolIndex(
                new ResourcePool("CMRP"),
                "Default index",
                new ElementField(
                    new Element(new ResourcePool("CMRP"), "Element"),
                    "Field",
                    true,
                    ElementFieldTypes.Boolean));
        }
    }
}
