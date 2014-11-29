using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ResourcePoolTests
    {
        [TestMethod]
        public void NewResourcePool()
        {
            var newResourcePool = new ResourcePool();
        }

        [TestMethod]
        public void TwoElementItems_StringTypeIndex_SingleUser()
        {
            // Arrange + act
            var resourcePool = new ResourcePool("Default");

            var organization = new Element(resourcePool, "Organization") { IsMainElement = true };
            resourcePool.ElementSet.Add(organization);

            var organizationName = new ElementField() { Element = organization, Name = "Organization Name", ElementFieldType = (byte)ElementFieldType.String };
            organization.ElementFieldSet.Add(organizationName);

            var salesPrice = new ElementField() { Element = organization, Name = "Sales Price", ElementFieldType = (byte)ElementFieldType.ResourcePool };
            organization.ElementFieldSet.Add(salesPrice);

            var salesNumber = new ElementField() { Element = organization, Name = "Sales Number", ElementFieldType = (byte)ElementFieldType.Multiplier };
            organization.ElementFieldSet.Add(salesNumber);

            var organization1 = new ElementItem() { Element = organization };
            organization.ElementItemSet.Add(organization1);

            var organizationName1 = new ElementCell() { ElementField = organizationName, ElementItem = organization1, StringValue = "Organization 1" };
            organization1.ElementCellSet.Add(organizationName1);
            organizationName.ElementCellSet.Add(organizationName1);

            var organizationSalesPrice1 = new ElementCell() { ElementField = salesPrice, ElementItem = organization1, DecimalValue = 200 };
            organization1.ElementCellSet.Add(organizationSalesPrice1);
            salesPrice.ElementCellSet.Add(organizationSalesPrice1);

            var organizationSalesNumber1 = new ElementCell() { ElementField = salesNumber, ElementItem = organization1, DecimalValue = 1 };
            organization1.ElementCellSet.Add(organizationSalesNumber1);
            salesNumber.ElementCellSet.Add(organizationSalesNumber1);

            var organization2 = new ElementItem() { Element = organization };
            organization.ElementItemSet.Add(organization2);

            var organizationName2 = new ElementCell() { ElementField = organizationName, ElementItem = organization2, StringValue = "Organization 2" };
            organization2.ElementCellSet.Add(organizationName2);
            organizationName.ElementCellSet.Add(organizationName2);

            var organizationSalesPrice2 = new ElementCell() { ElementField = salesPrice, ElementItem = organization2, DecimalValue = 200 };
            organization2.ElementCellSet.Add(organizationSalesPrice2);
            salesPrice.ElementCellSet.Add(organizationSalesPrice2);

            var organizationSalesNumber2 = new ElementCell() { ElementField = salesNumber, ElementItem = organization2, DecimalValue = 1 };
            organization2.ElementCellSet.Add(organizationSalesNumber2);
            salesNumber.ElementCellSet.Add(organizationSalesNumber2);

            var resourcePoolIndex = new ResourcePoolIndex()
            {
                ResourcePool = resourcePool,
                ElementField = organizationName,
                RatingSortType = (byte)RatingSortType.HighestToLowest
            };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex);
            organizationName.ResourcePoolIndexSet.Add(resourcePoolIndex);

            var user = new User();

            var userResourcePool = new UserResourcePool() { User = user, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user.UserResourcePoolSet.Add(userResourcePool);
            resourcePool.UserResourcePoolSet.Add(userResourcePool);

            var userResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = userResourcePool, ResourcePoolIndex = resourcePoolIndex, Rating = 100 };
            resourcePoolIndex.UserResourcePoolIndexSet.Add(userResourcePoolIndex);

            var userOrganizationName1 = new UserElementCell() { User = user, ElementCell = organizationName1, Rating = 75 };
            user.UserElementCellSet.Add(userOrganizationName1);
            organizationName1.UserElementCellSet.Add(userOrganizationName1);

            var userOrganizationName2 = new UserElementCell() { User = user, ElementCell = organizationName2, Rating = 25 };
            user.UserElementCellSet.Add(userOrganizationName1);
            organizationName2.UserElementCellSet.Add(userOrganizationName2);

            // Assert
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 1);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingPercentage == 1);

            Assert.IsTrue(organizationName.RatingAverage == 100);

            Assert.IsTrue(organizationName1.RatingCount == 1);
            Assert.IsTrue(organizationName1.RatingAverage == 75);
            Assert.IsTrue(organizationName1.RatingPercentage == 0.75M);

            Assert.IsTrue(organizationName2.RatingCount == 1);
            Assert.IsTrue(organizationName2.RatingAverage == 25);
            Assert.IsTrue(organizationName2.RatingPercentage == 0.25M);

            Assert.IsTrue(resourcePool.ResourcePoolAddition == 400);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition == 800);
            Assert.IsTrue(resourcePool.TotalResourcePoolValue == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition == 800);
            Assert.IsTrue(resourcePool.TotalIncome == 800);

            Assert.IsTrue(resourcePoolIndex.IndexShare == 400);

            Assert.IsTrue(organization1.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 300);
            Assert.IsTrue(organization1.TotalIncome == 500);

            Assert.IsTrue(organization2.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization2.ResourcePoolIndexIncome == 100);
            Assert.IsTrue(organization2.TotalIncome == 300);

            // Arrange + act 2
            // TODO Since creating the whole scenario needs too much configuration,
            // it contains two different tests, try to separate them
            resourcePoolIndex.RatingSortType = (byte)RatingSortType.LowestToHighest;

            // Assert 2
            Assert.IsTrue(organization1.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 100);
            Assert.IsTrue(organization1.TotalIncome == 300);

            Assert.IsTrue(organization2.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization2.ResourcePoolAddition == 200);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization2.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization2.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization2.ResourcePoolIndexIncome == 300);
            Assert.IsTrue(organization2.TotalIncome == 500);
        }

        [TestMethod]
        public void TwoElementItems_DecimalTypeIndex_SingleUser()
        {
            // Arrange + act
            var resourcePool = new ResourcePool("Default");
            
            var organization = new Element(resourcePool, "Main Element") { IsMainElement = true };
            resourcePool.ElementSet.Add(organization);

            var salesPrice = new ElementField() { Element = organization, Name = "Sales Price", ElementFieldType = (byte)ElementFieldType.ResourcePool };
            organization.ElementFieldSet.Add(salesPrice);

            var salesNumber = new ElementField() { Element = organization, Name = "Sales Number", ElementFieldType = (byte)ElementFieldType.Multiplier };
            organization.ElementFieldSet.Add(salesNumber);

            var organization1 = new ElementItem() { Element = organization };
            organization.ElementItemSet.Add(organization1);

            var organizationSalesPrice1 = new ElementCell() { ElementField = salesPrice, ElementItem = organization1, DecimalValue = 25 };
            organization1.ElementCellSet.Add(organizationSalesPrice1);
            salesPrice.ElementCellSet.Add(organizationSalesPrice1);

            var organizationSalesNumber1 = new ElementCell() { ElementField = salesNumber, ElementItem = organization1, DecimalValue = 1 };
            organization1.ElementCellSet.Add(organizationSalesNumber1);
            salesNumber.ElementCellSet.Add(organizationSalesNumber1);

            var organization2 = new ElementItem() { Element = organization };
            organization.ElementItemSet.Add(organization2);

            var organizationSalesPrice2 = new ElementCell() { ElementField = salesPrice, ElementItem = organization2, DecimalValue = 75 };
            organization2.ElementCellSet.Add(organizationSalesPrice2);
            salesPrice.ElementCellSet.Add(organizationSalesPrice2);

            var organizationSalesNumber2 = new ElementCell() { ElementField = salesNumber, ElementItem = organization2, DecimalValue = 1 };
            organization2.ElementCellSet.Add(organizationSalesNumber2);
            salesNumber.ElementCellSet.Add(organizationSalesNumber2);

            var resourcePoolIndex = new ResourcePoolIndex()
            {
                ResourcePool = resourcePool,
                ElementField = salesPrice,
                RatingSortType = (byte)RatingSortType.LowestToHighest
            };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex);
            salesPrice.ResourcePoolIndexSet.Add(resourcePoolIndex);

            var user = new User();

            var userResourcePool = new UserResourcePool() { User = user, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user.UserResourcePoolSet.Add(userResourcePool);
            resourcePool.UserResourcePoolSet.Add(userResourcePool);

            var userResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = userResourcePool, ResourcePoolIndex = resourcePoolIndex, Rating = 100 };
            resourcePoolIndex.UserResourcePoolIndexSet.Add(userResourcePoolIndex);

            // Assert
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 1);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingPercentage == 1);

            Assert.IsTrue(salesPrice.RatingAverage == 100);

            Assert.IsTrue(resourcePool.ResourcePoolAddition == 100);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition == 200);
            Assert.IsTrue(resourcePool.TotalResourcePoolValue == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition == 200);
            Assert.IsTrue(resourcePool.TotalIncome == 200);

            Assert.IsTrue(resourcePoolIndex.IndexShare == 100);

            Assert.IsTrue(organization1.ResourcePoolCellValue == 25);
            Assert.IsTrue(organization1.ResourcePoolAddition == 25);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 50);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 25);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 25);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 50);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 75);
            Assert.IsTrue(organization1.TotalIncome == 100);

            Assert.IsTrue(organization2.ResourcePoolCellValue == 75);
            Assert.IsTrue(organization2.ResourcePoolAddition == 75);
            Assert.IsTrue(organization2.ResourcePoolValueIncludingAddition == 150);
            Assert.IsTrue(organization2.TotalResourcePoolValue == 75);
            Assert.IsTrue(organization2.TotalResourcePoolAddition == 75);
            Assert.IsTrue(organization2.TotalResourcePoolValueIncludingAddition == 150);
            Assert.IsTrue(organization2.ResourcePoolIndexIncome == 25);
            Assert.IsTrue(organization2.TotalIncome == 100);
        }
    }
}
