using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class UserElementCellTests
    {
        [TestMethod]
        public void NewUserElementCell_ShouldCreate()
        {
            var newUser = new User("User", "user@email.com");

            var newElement = new ResourcePool(newUser, "CMRP")
                .AddElement("Element");

            var newField = newElement.AddField("Field", ElementFieldDataType.Decimal, false);

            newElement
                .AddItem("Item")
                .AddCell(newField)
                .SetValue(0);
        }
    }
}
