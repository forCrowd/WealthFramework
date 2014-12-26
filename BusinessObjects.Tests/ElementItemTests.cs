using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementItemTests
    {
        [TestMethod]
        public void NewElementItem_ShouldCreate()
        {
            new ResourcePool("CMRP")
                .AddElement("Element")
                .AddItem("Item");
        }
    }
}
