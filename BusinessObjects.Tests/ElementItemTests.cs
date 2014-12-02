using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementItemTests
    {
        [TestMethod]
        public void NewElementItemShouldCreate()
        {
            var newElementItem = new ElementItem(
                new Element(new ResourcePool("CMRP"), "Element"),
                "Default item");
        }
    }
}
