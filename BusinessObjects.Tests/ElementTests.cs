using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementTests
    {
        [TestMethod]
        public void NewElement_ShouldCreate()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element");
        }

        [TestMethod]
        public void AddField_SortOrder_ShouldCalculate()
        {
            // Arrange
            var user = new User("User");
            var element = new ResourcePool(user, "CMRP")
                 .AddElement("Element");

            // Act
            var secondField = element.AddField("Second field after default Name field", ElementFieldTypes.String);

            // Assert
            Assert.IsTrue(secondField.SortOrder == 2);
        }
    }
}
