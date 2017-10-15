using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementCellTests
    {
        [TestMethod]
        public void NewElementCell_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            var newElement = new ResourcePool(user, "CMRP")
                .AddElement("Element");

            var newField = newElement.AddField("Field", ElementFieldDataType.String);

            newElement.AddItem("Item").AddCell(newField);
        }
    }
}
