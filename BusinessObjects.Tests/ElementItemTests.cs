using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementItemTests
    {
        [TestMethod]
        public void NewElementItem_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            new Project(user, "CMRP")
                .AddElement("Element")
                .AddItem("Item");
        }
    }
}
