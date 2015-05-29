using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementCellTests
    {
        [TestMethod]
        public void NewElementCell_ShouldCreate()
        {
            var user = new User("User");
            var newElement = new ResourcePool(user, "CMRP")
                .AddElement("Element");

            var newField = newElement.AddField("Field", ElementFieldTypes.String);

            newElement.AddItem("Item").AddCell(newField);
        }
    }
}
