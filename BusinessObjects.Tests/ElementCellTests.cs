using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementCellTests
    {
        [TestMethod]
        public void NewElementCell_ShouldCreate()
        {
            var newElement = new ResourcePool("CMRP")
                .AddElement("Element");

            var newField = newElement.AddField("Field", ElementFieldTypes.String);

            newElement.AddItem("Item").AddCell(newField);
        }
    }
}
