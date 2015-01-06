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

        [TestMethod]
        public void AddField_SortOrder_ShouldCalculate()
        {
            // Arrange
            var element = new ResourcePool("CMRP")
                 .AddElement("Element");

            // Act
            var secondField = element.AddField("Second field after default Name field", ElementFieldTypes.String);

            // Assert
            Assert.IsTrue(secondField.SortOrder == 2);
        }
    }
}
