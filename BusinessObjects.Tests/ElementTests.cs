using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementTests
    {
        [TestMethod]
        public void NewElement_ShouldCreate()
        {
            new ResourcePool("CMRP")
                .AddElement("Element");
        }
    }
}
