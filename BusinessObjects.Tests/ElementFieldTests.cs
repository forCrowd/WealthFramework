using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldTests
    {
        [TestMethod]
        public void NewElementFieldShouldCreate()
        {
            var newElementField = new ElementField(
                new Element(new ResourcePool("CMRP"), "Element"),
                "Default field",
                ElementFieldTypes.Boolean);
        }
    }
}
