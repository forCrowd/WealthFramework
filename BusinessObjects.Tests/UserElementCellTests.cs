using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserElementCellTests
    {
        [TestMethod]
        public void NewUserElementCellShouldCreate()
        {
            var newElement = new Element(new ResourcePool("CMRP"), "Element");
            var newElementCell = new ElementCell(
                new ElementField(newElement, "Field", ElementFieldTypes.Boolean),
                new ElementItem(newElement, "Item"));

            var newUserElementCell = new UserElementCell(
                new User("Email"),
                newElementCell,
                0);
        }
    }
}
