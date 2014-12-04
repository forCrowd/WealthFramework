using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ResourcePoolTests
    {
        [TestMethod]
        public void NewResourcePoolShouldCreate()
        {
            var newResourcePool = new ResourcePool("Default");
        }

        [TestMethod]
        public void TwoElementItems_ImportanceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("Email");

            var resourcePool = new ResourcePool("Default");

            var organization = resourcePool.AddElement("Organization");

            organization
                    .AddField("Sales Price", true, ElementFieldTypes.ResourcePool)
                .Element
                    .AddField("Sales Number", true, ElementFieldTypes.Multiplier);
            var importanceField = resourcePool.MainElement.AddField("Importance Field", false, ElementFieldTypes.Decimal);

            var resourcePoolIndex = resourcePool.AddIndex("Importance Index", importanceField, RatingSortType.HighestToLowest);

            var organization1 = organization.AddItem("Organization 1");
            organization1
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M)
                .ElementItem
                    .AddCell(importanceField).AddUserCell(user).SetValue(75M);

            var organization2 = organization.AddItem("Organization 2");
            organization2
                    .AddCell(organization.ResourcePoolField).SetValue(200M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M)
                .ElementItem
                    .AddCell(importanceField).AddUserCell(user).SetValue(25M);

            resourcePool.AddUserResourcePool(user, 100)
                .AddIndex(resourcePoolIndex, 100);

            // Assert
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePool.ResourcePoolAddition == 400);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition == 800);
            Assert.IsTrue(resourcePool.TotalResourcePoolValue == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition == 400);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition == 800);
            Assert.IsTrue(resourcePool.TotalIncome == 800);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 1);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingPercentage == 1);
            Assert.IsTrue(resourcePoolIndex.IndexShare == 400);

            Assert.IsTrue(organization1.RatingCount == 1);
            Assert.IsTrue(organization1.RatingAverage == 75);
            Assert.IsTrue(organization1.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 300);
            Assert.IsTrue(organization1.TotalIncome == 500);

            Assert.IsTrue(organization2.RatingCount == 1);
            Assert.IsTrue(organization2.RatingAverage == 25);
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
            Assert.IsTrue(organization1.RatingCount == 1);
            Assert.IsTrue(organization1.RatingAverage == 75);
            Assert.IsTrue(organization1.ResourcePoolCellValue == 200);
            Assert.IsTrue(organization1.ResourcePoolAddition == 200);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 200);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 200);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 400);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 100);
            Assert.IsTrue(organization1.TotalIncome == 300);

            Assert.IsTrue(organization2.RatingCount == 1);
            Assert.IsTrue(organization2.RatingAverage == 25);
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
        public void TwoElementItems_SalesPriceIndex_SingleUser()
        {
            // Arrange + act
            var user = new User("Email");

            var resourcePool = new ResourcePool("Default");

            var organization = resourcePool.AddElement("Organization");

            organization
                    .AddField("Sales Price", true, ElementFieldTypes.ResourcePool)
                .Element
                    .AddField("Sales Number", true, ElementFieldTypes.Multiplier);

            var resourcePoolIndex = resourcePool.AddIndex("Importance Index", organization.ResourcePoolField, RatingSortType.LowestToHighest);

            var organization1 = organization.AddItem("Organization 1");
            organization1
                    .AddCell(organization.ResourcePoolField).SetValue(25M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M);

            var organization2 = organization.AddItem("Organization 2");
            organization2
                    .AddCell(organization.ResourcePoolField).SetValue(75M)
                .ElementItem
                    .AddCell(organization.MultiplierField).SetValue(1M);

            resourcePool.AddUserResourcePool(user, 100)
                .AddIndex(resourcePoolIndex, 100);

            // Assert
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePool.ResourcePoolAddition == 100);
            Assert.IsTrue(resourcePool.ResourcePoolValueIncludingAddition == 200);
            Assert.IsTrue(resourcePool.TotalResourcePoolValue == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolAddition == 100);
            Assert.IsTrue(resourcePool.TotalResourcePoolValueIncludingAddition == 200);
            Assert.IsTrue(resourcePool.TotalIncome == 200);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 1);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingPercentage == 1);
            Assert.IsTrue(resourcePoolIndex.IndexShare == 100);

            Assert.IsTrue(organization1.RatingCount == 1);
            Assert.IsTrue(organization1.RatingAverage == 25);
            Assert.IsTrue(organization1.ResourcePoolCellValue == 25);
            Assert.IsTrue(organization1.ResourcePoolAddition == 25);
            Assert.IsTrue(organization1.ResourcePoolValueIncludingAddition == 50);
            Assert.IsTrue(organization1.TotalResourcePoolValue == 25);
            Assert.IsTrue(organization1.TotalResourcePoolAddition == 25);
            Assert.IsTrue(organization1.TotalResourcePoolValueIncludingAddition == 50);
            Assert.IsTrue(organization1.ResourcePoolIndexIncome == 75);
            Assert.IsTrue(organization1.TotalIncome == 100);

            Assert.IsTrue(organization2.RatingCount == 1);
            Assert.IsTrue(organization2.RatingAverage == 75);
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
