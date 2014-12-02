using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementTests
    {
        [TestMethod]
        public void NewElementShouldCreate()
        {
            var newElement = new Element(new ResourcePool("CMRP"), "Default element");
        }
    }
}
