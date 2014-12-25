using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldIndexTests
    {
        [TestMethod]
        public void NewElementFieldIndexShouldCreate()
        {
            var newElementFieldIndex = new ElementFieldIndex(
                new ElementField(
                    new Element(new ResourcePool("CMRP"), "Element"),
                    "Field",
                    true,
                    ElementFieldTypes.Boolean),
                "Default index");
        }
    }
}
