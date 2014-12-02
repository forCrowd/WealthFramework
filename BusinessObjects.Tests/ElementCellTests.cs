using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementCellTests
    {
        [TestMethod]
        public void NewElementCellShouldCreate()
        {
            var newElement = new Element(new ResourcePool("CMRP"), "Element");
            var newElementCell = new ElementCell(
                new ElementField(newElement, "Field", ElementFieldTypes.Boolean),
                new ElementItem(newElement, "Item"));
        }
    }
}
