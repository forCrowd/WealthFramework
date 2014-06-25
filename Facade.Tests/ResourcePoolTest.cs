namespace Facade.Tests
{
    using BusinessObjects;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class ResourcePoolTest
    {
        [TestMethod]
        public void SingleIndex_SingleUser_TwoOrganizations()
        {
            var resourcePool = new ResourcePool();

            var resourcePoolIndex = new ResourcePoolIndex() {   ResourcePool = resourcePool };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex);

            var sector = new Sector() { ResourcePool = resourcePool };
            resourcePool.SectorSet.Add(sector);

            var organization1 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization1);

            var organization2 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization2);

            var resourcePoolIndexOrganization1 = new ResourcePoolIndexOrganization(resourcePoolIndex, organization1);
            var resourcePoolIndexOrganization2 = new ResourcePoolIndexOrganization(resourcePoolIndex, organization2);
            
            var user = new User();

            var userResourcePool = new UserResourcePool() { User = user, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user.UserResourcePoolSet.Add(userResourcePool);
            resourcePool.UserResourcePoolSet.Add(userResourcePool);

            var userResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = userResourcePool, ResourcePoolIndex = resourcePoolIndex, Rating = 100 };
            resourcePoolIndex.UserResourcePoolIndexSet.Add(userResourcePoolIndex);

            var userOrganization1 = new UserOrganization() { User = user, Organization = organization1, NumberOfSales = 1 };
            user.UserOrganizationSet.Add(userOrganization1);
            organization1.UserOrganizationSet.Add(userOrganization1);

            var userOrganization2 = new UserOrganization() { User = user, Organization = organization2, NumberOfSales = 1 };
            user.UserOrganizationSet.Add(userOrganization2);
            organization2.UserOrganizationSet.Add(userOrganization2);

            var userResourcePoolIndexValue1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex, Organization = organization1, Rating = 75 };
            userResourcePoolIndex.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1);

            var userResourcePoolIndexValue2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex, Organization = organization2, Rating = 25 };
            userResourcePoolIndex.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2);

            var userResourcePoolIndexOrganization1 = new UserResourcePoolIndexOrganization(userOrganization1, resourcePoolIndexOrganization1);
            var userResourcePoolIndexOrganization2 = new UserResourcePoolIndexOrganization(userOrganization2, resourcePoolIndexOrganization2);

            // Results
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePool.ProductionCost == 200);
            Assert.IsTrue(resourcePool.Profit == 200);
            Assert.IsTrue(resourcePool.SalesPrice == 400);
            Assert.IsTrue(resourcePool.TotalIndexRatingAverage == 100);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 1);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingWeightedAverage == 1);
            Assert.IsTrue(resourcePoolIndex.IndexValueAverage == 100);

            Assert.IsTrue(organization1.Profit == 100);
            Assert.IsTrue(organization2.Profit == 100);

            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueCount == 1);
            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueAverage == 75);
            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueWeightedAverage == 0.75M);

            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueCount == 1);
            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueAverage == 25);
            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueWeightedAverage == 0.25M);

            Assert.IsTrue(userResourcePool.NumberOfSales == 2);
            Assert.IsTrue(userResourcePool.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool.TotalIncome == 600);
            Assert.IsTrue(userResourcePool.TotalProductionCost == 200);
            Assert.IsTrue(userResourcePool.TotalProfit == 200);
            Assert.IsTrue(userResourcePool.TotalResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool.TotalSalesRevenue == 400);
            Assert.IsTrue(userResourcePool.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userResourcePoolIndex.IndexShare == 400);
            Assert.IsTrue(userResourcePoolIndex.IndexValueWeightedAverageWithNumberOfSales == 1);

            Assert.IsTrue(userOrganization1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1.TotalIncome == 400);
            Assert.IsTrue(userOrganization1.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1.TotalProfit == 100);
            Assert.IsTrue(userOrganization1.TotalResourcePoolIncome == 300);
            Assert.IsTrue(userOrganization1.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userOrganization2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2.TotalIncome == 200);
            Assert.IsTrue(userOrganization2.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization2.TotalProfit == 100);
            Assert.IsTrue(userOrganization2.TotalResourcePoolIncome == 100);
            Assert.IsTrue(userOrganization2.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization2.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userResourcePoolIndexOrganization1.IndexIncome == 300);
            Assert.IsTrue(userResourcePoolIndexOrganization1.IndexValueWeightedAverageWithNumberOfSales == 0.75M);
            Assert.IsTrue(userResourcePoolIndexOrganization1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.75M);

            Assert.IsTrue(userResourcePoolIndexOrganization2.IndexIncome == 100);
            Assert.IsTrue(userResourcePoolIndexOrganization2.IndexValueWeightedAverageWithNumberOfSales == 0.25M);
            Assert.IsTrue(userResourcePoolIndexOrganization2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.25M);
        }

        [TestMethod]
        public void SingleIndex_TwoUsers_TwoOrganizations()
        {
            var resourcePool = new ResourcePool();

            var resourcePoolIndex = new ResourcePoolIndex() { ResourcePool = resourcePool };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex);

            var sector = new Sector() { ResourcePool = resourcePool };
            resourcePool.SectorSet.Add(sector);

            var organization1 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization1);

            var organization2 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization2);

            var resourcePoolIndexOrganization1 = new ResourcePoolIndexOrganization(resourcePoolIndex, organization1);
            var resourcePoolIndexOrganization2 = new ResourcePoolIndexOrganization(resourcePoolIndex, organization2);

            var user1 = new User();

            var userResourcePool1 = new UserResourcePool() { User = user1, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user1.UserResourcePoolSet.Add(userResourcePool1);
            resourcePool.UserResourcePoolSet.Add(userResourcePool1);

            var userResourcePoolIndex1 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool1, ResourcePoolIndex = resourcePoolIndex, Rating = 100 };
            resourcePoolIndex.UserResourcePoolIndexSet.Add(userResourcePoolIndex1);

            var userOrganization1_1 = new UserOrganization() { User = user1, Organization = organization1, NumberOfSales = 1 };
            user1.UserOrganizationSet.Add(userOrganization1_1);
            organization1.UserOrganizationSet.Add(userOrganization1_1);

            var userOrganization1_2 = new UserOrganization() { User = user1, Organization = organization2, NumberOfSales = 1 };
            user1.UserOrganizationSet.Add(userOrganization1_2);
            organization2.UserOrganizationSet.Add(userOrganization1_2);

            var userResourcePoolIndexValue1_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1, Organization = organization1, Rating = 80 };
            userResourcePoolIndex1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1);

            var userResourcePoolIndexValue1_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1, Organization = organization2, Rating = 20 };
            userResourcePoolIndex1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2);

            var userResourcePoolIndexOrganization1_1 = new UserResourcePoolIndexOrganization(userOrganization1_1, resourcePoolIndexOrganization1);
            var userResourcePoolIndexOrganization1_2 = new UserResourcePoolIndexOrganization(userOrganization1_2, resourcePoolIndexOrganization2);

            var user2 = new User();

            var userResourcePool2 = new UserResourcePool() { User = user2, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user2.UserResourcePoolSet.Add(userResourcePool2);
            resourcePool.UserResourcePoolSet.Add(userResourcePool2);

            var userResourcePoolIndex2 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool2, ResourcePoolIndex = resourcePoolIndex, Rating = 100 };
            resourcePoolIndex.UserResourcePoolIndexSet.Add(userResourcePoolIndex2);

            var userOrganization2_1 = new UserOrganization() { User = user2, Organization = organization1, NumberOfSales = 2 };
            user2.UserOrganizationSet.Add(userOrganization2_1);
            organization1.UserOrganizationSet.Add(userOrganization2_1);

            var userOrganization2_2 = new UserOrganization() { User = user2, Organization = organization2, NumberOfSales = 2 };
            user2.UserOrganizationSet.Add(userOrganization2_2);
            organization2.UserOrganizationSet.Add(userOrganization2_2);

            var userResourcePoolIndexValue2_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2, Organization = organization1, Rating = 40 };
            userResourcePoolIndex2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1);

            var userResourcePoolIndexValue2_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2, Organization = organization2, Rating = 60 };
            userResourcePoolIndex2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2);

            var userResourcePoolIndexOrganization2_1 = new UserResourcePoolIndexOrganization(userOrganization2_1, resourcePoolIndexOrganization1);
            var userResourcePoolIndexOrganization2_2 = new UserResourcePoolIndexOrganization(userOrganization2_2, resourcePoolIndexOrganization2);

            // Results
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePool.ProductionCost == 200);
            Assert.IsTrue(resourcePool.Profit == 200);
            Assert.IsTrue(resourcePool.SalesPrice == 400);
            Assert.IsTrue(resourcePool.TotalIndexRatingAverage == 100);

            Assert.IsTrue(resourcePoolIndex.IndexRatingCount == 2);
            Assert.IsTrue(resourcePoolIndex.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePoolIndex.IndexRatingWeightedAverage == 1);
            Assert.IsTrue(resourcePoolIndex.IndexValueAverage == 100);

            Assert.IsTrue(organization1.Profit == 100);
            Assert.IsTrue(organization2.Profit == 100);

            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueAverage == 60);
            Assert.IsTrue(resourcePoolIndexOrganization1.IndexValueWeightedAverage == 0.6M);

            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueAverage == 40);
            Assert.IsTrue(resourcePoolIndexOrganization2.IndexValueWeightedAverage == 0.4M);

            // User 1
            Assert.IsTrue(userResourcePool1.NumberOfSales == 2);
            Assert.IsTrue(userResourcePool1.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool1.TotalIncome == 600);
            Assert.IsTrue(userResourcePool1.TotalProductionCost == 200);
            Assert.IsTrue(userResourcePool1.TotalProfit == 200);
            Assert.IsTrue(userResourcePool1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenue == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userResourcePoolIndex1.IndexShare == 400);
            Assert.IsTrue(userResourcePoolIndex1.IndexValueWeightedAverageWithNumberOfSales == 1);

            Assert.IsTrue(userOrganization1_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_1.TotalIncome == 340);
            Assert.IsTrue(userOrganization1_1.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_1.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolIncome == 240);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userOrganization1_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_2.TotalIncome == 260);
            Assert.IsTrue(userOrganization1_2.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_2.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolIncome == 160);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userResourcePoolIndexOrganization1_1.IndexIncome == 240);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1.IndexValueWeightedAverageWithNumberOfSales == 0.6M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization1_2.IndexIncome == 160);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2.IndexValueWeightedAverageWithNumberOfSales == 0.4M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);

            // User 2
            Assert.IsTrue(userResourcePool2.NumberOfSales == 4);
            Assert.IsTrue(userResourcePool2.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool2.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalIncome == 1200);
            Assert.IsTrue(userResourcePool2.TotalProductionCost == 400);
            Assert.IsTrue(userResourcePool2.TotalProfit == 400);
            Assert.IsTrue(userResourcePool2.TotalResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenue == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenueIncludingResourcePoolTax == 1600);

            Assert.IsTrue(userResourcePoolIndex2.IndexShare == 800);
            Assert.IsTrue(userResourcePoolIndex2.IndexValueWeightedAverageWithNumberOfSales == 2);

            Assert.IsTrue(userOrganization2_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalIncome == 680);
            Assert.IsTrue(userOrganization2_1.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_1.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolIncome == 480);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userOrganization2_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalIncome == 520);
            Assert.IsTrue(userOrganization2_2.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_2.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolIncome == 320);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userResourcePoolIndexOrganization2_1.IndexIncome == 480);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1.IndexValueWeightedAverageWithNumberOfSales == 1.2M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization2_2.IndexIncome == 320);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2.IndexValueWeightedAverageWithNumberOfSales == 0.8M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);
        }

        [TestMethod]
        public void TwoIndexes_TwoUsers_TwoOrganizations()
        {
            var resourcePool = new ResourcePool();

            var resourcePoolIndex1 = new ResourcePoolIndex() { ResourcePool = resourcePool };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex1);

            var resourcePoolIndex2 = new ResourcePoolIndex() { ResourcePool = resourcePool };
            resourcePool.ResourcePoolIndexSet.Add(resourcePoolIndex2);

            var sector = new Sector() { ResourcePool = resourcePool };
            resourcePool.SectorSet.Add(sector);

            var organization1 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization1);

            var organization2 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization2);

            var resourcePoolIndexOrganization1_1 = new ResourcePoolIndexOrganization(resourcePoolIndex1, organization1);
            var resourcePoolIndexOrganization1_2 = new ResourcePoolIndexOrganization(resourcePoolIndex1, organization2);
            var resourcePoolIndexOrganization2_1 = new ResourcePoolIndexOrganization(resourcePoolIndex2, organization1);
            var resourcePoolIndexOrganization2_2 = new ResourcePoolIndexOrganization(resourcePoolIndex2, organization2);

            var user1 = new User();

            var userResourcePool1 = new UserResourcePool() { User = user1, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user1.UserResourcePoolSet.Add(userResourcePool1);
            resourcePool.UserResourcePoolSet.Add(userResourcePool1);

            var userResourcePoolIndex1_1 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool1, ResourcePoolIndex = resourcePoolIndex1, Rating = 80 };
            resourcePoolIndex1.UserResourcePoolIndexSet.Add(userResourcePoolIndex1_1);

            var userResourcePoolIndex2_1 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool1, ResourcePoolIndex = resourcePoolIndex2, Rating = 20 };
            resourcePoolIndex2.UserResourcePoolIndexSet.Add(userResourcePoolIndex2_1);

            var userOrganization1_1 = new UserOrganization() { User = user1, Organization = organization1, NumberOfSales = 1 };
            user1.UserOrganizationSet.Add(userOrganization1_1);
            organization1.UserOrganizationSet.Add(userOrganization1_1);

            var userOrganization1_2 = new UserOrganization() { User = user1, Organization = organization2, NumberOfSales = 1 };
            user1.UserOrganizationSet.Add(userOrganization1_2);
            organization2.UserOrganizationSet.Add(userOrganization1_2);

            var userResourcePoolIndexValue1_1_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1_1, Organization = organization1, Rating = 80 };
            userResourcePoolIndex1_1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1_1);

            var userResourcePoolIndexValue1_1_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1_1, Organization = organization2, Rating = 20 };
            userResourcePoolIndex1_1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_1_2);

            var userResourcePoolIndexOrganization1_1_1 = new UserResourcePoolIndexOrganization(userOrganization1_1, resourcePoolIndexOrganization1_1);
            var userResourcePoolIndexOrganization1_1_2 = new UserResourcePoolIndexOrganization(userOrganization1_2, resourcePoolIndexOrganization1_2);

            var userResourcePoolIndexValue2_1_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2_1, Organization = organization1, Rating = 80 };
            userResourcePoolIndex2_1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1_1);

            var userResourcePoolIndexValue2_1_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2_1, Organization = organization2, Rating = 20 };
            userResourcePoolIndex2_1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_1_2);

            var userResourcePoolIndexOrganization2_1_1 = new UserResourcePoolIndexOrganization(userOrganization1_1, resourcePoolIndexOrganization2_1);
            var userResourcePoolIndexOrganization2_1_2 = new UserResourcePoolIndexOrganization(userOrganization1_2, resourcePoolIndexOrganization2_2);

            var user2 = new User();

            var userResourcePool2 = new UserResourcePool() { User = user2, ResourcePool = resourcePool, ResourcePoolRate = 100 };
            user2.UserResourcePoolSet.Add(userResourcePool2);
            resourcePool.UserResourcePoolSet.Add(userResourcePool2);

            var userResourcePoolIndex1_2 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool2, ResourcePoolIndex = resourcePoolIndex1, Rating = 40 };
            resourcePoolIndex1.UserResourcePoolIndexSet.Add(userResourcePoolIndex1_2);

            var userResourcePoolIndex2_2 = new UserResourcePoolIndex() { UserResourcePool = userResourcePool2, ResourcePoolIndex = resourcePoolIndex2, Rating = 60 };
            resourcePoolIndex2.UserResourcePoolIndexSet.Add(userResourcePoolIndex2_2);

            var userOrganization2_1 = new UserOrganization() { User = user2, Organization = organization1, NumberOfSales = 2 };
            user2.UserOrganizationSet.Add(userOrganization2_1);
            organization1.UserOrganizationSet.Add(userOrganization2_1);

            var userOrganization2_2 = new UserOrganization() { User = user2, Organization = organization2, NumberOfSales = 2 };
            user2.UserOrganizationSet.Add(userOrganization2_2);
            organization2.UserOrganizationSet.Add(userOrganization2_2);

            var userResourcePoolIndexValue1_2_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1_2, Organization = organization1, Rating = 40 };
            userResourcePoolIndex1_2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2_1);

            var userResourcePoolIndexValue1_2_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex1_2, Organization = organization2, Rating = 60 };
            userResourcePoolIndex1_2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue1_2_2);

            var userResourcePoolIndexOrganization1_2_1 = new UserResourcePoolIndexOrganization(userOrganization2_1, resourcePoolIndexOrganization1_1);
            var userResourcePoolIndexOrganization1_2_2 = new UserResourcePoolIndexOrganization(userOrganization2_2, resourcePoolIndexOrganization1_2);

            var userResourcePoolIndexValue2_2_1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2_2, Organization = organization1, Rating = 40 };
            userResourcePoolIndex2_2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2_1);
            organization1.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2_1);

            var userResourcePoolIndexValue2_2_2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = userResourcePoolIndex2_2, Organization = organization2, Rating = 60 };
            userResourcePoolIndex2_2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2_2);
            organization2.UserResourcePoolIndexValueSet.Add(userResourcePoolIndexValue2_2_2);

            var userResourcePoolIndexOrganization2_2_1 = new UserResourcePoolIndexOrganization(userOrganization2_1, resourcePoolIndexOrganization2_1);
            var userResourcePoolIndexOrganization2_2_2 = new UserResourcePoolIndexOrganization(userOrganization2_2, resourcePoolIndexOrganization2_2);

            // Results
            Assert.IsTrue(resourcePool.IndexRatingAverage == 100);
            Assert.IsTrue(resourcePool.ProductionCost == 200);
            Assert.IsTrue(resourcePool.Profit == 200);
            Assert.IsTrue(resourcePool.SalesPrice == 400);
            Assert.IsTrue(resourcePool.TotalIndexRatingAverage == 100);

            Assert.IsTrue(resourcePoolIndex1.IndexRatingCount == 2);
            Assert.IsTrue(resourcePoolIndex1.IndexRatingAverage == 60);
            Assert.IsTrue(resourcePoolIndex1.IndexRatingWeightedAverage == 0.6M);
            Assert.IsTrue(resourcePoolIndex1.IndexValueAverage == 100);

            Assert.IsTrue(resourcePoolIndex2.IndexRatingCount == 2);
            Assert.IsTrue(resourcePoolIndex2.IndexRatingAverage == 40);
            Assert.IsTrue(resourcePoolIndex2.IndexRatingWeightedAverage == 0.4M);
            Assert.IsTrue(resourcePoolIndex2.IndexValueAverage == 100);

            Assert.IsTrue(organization1.Profit == 100);
            Assert.IsTrue(organization2.Profit == 100);

            Assert.IsTrue(resourcePoolIndexOrganization1_1.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization1_1.IndexValueAverage == 60);
            Assert.IsTrue(resourcePoolIndexOrganization1_1.IndexValueWeightedAverage == 0.6M);

            Assert.IsTrue(resourcePoolIndexOrganization1_2.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization1_2.IndexValueAverage == 40);
            Assert.IsTrue(resourcePoolIndexOrganization1_2.IndexValueWeightedAverage == 0.4M);

            Assert.IsTrue(resourcePoolIndexOrganization2_1.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization2_1.IndexValueAverage == 60);
            Assert.IsTrue(resourcePoolIndexOrganization2_1.IndexValueWeightedAverage == 0.6M);

            Assert.IsTrue(resourcePoolIndexOrganization2_2.IndexValueCount == 2);
            Assert.IsTrue(resourcePoolIndexOrganization2_2.IndexValueAverage == 40);
            Assert.IsTrue(resourcePoolIndexOrganization2_2.IndexValueWeightedAverage == 0.4M);

            // User 1
            Assert.IsTrue(userResourcePool1.NumberOfSales == 2);
            Assert.IsTrue(userResourcePool1.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool1.TotalIncome == 600);
            Assert.IsTrue(userResourcePool1.TotalProductionCost == 200);
            Assert.IsTrue(userResourcePool1.TotalProfit == 200);
            Assert.IsTrue(userResourcePool1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenue == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userResourcePoolIndex1_1.IndexShare == 240);
            Assert.IsTrue(userResourcePoolIndex1_1.IndexValueWeightedAverageWithNumberOfSales == 1);

            Assert.IsTrue(userResourcePoolIndex2_1.IndexShare == 160);
            Assert.IsTrue(userResourcePoolIndex2_1.IndexValueWeightedAverageWithNumberOfSales == 1);

            Assert.IsTrue(userOrganization1_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_1.TotalIncome == 340);
            Assert.IsTrue(userOrganization1_1.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_1.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolIncome == 240);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userOrganization1_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_2.TotalIncome == 260);
            Assert.IsTrue(userOrganization1_2.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_2.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolIncome == 160);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userResourcePoolIndexOrganization1_1_1.IndexIncome == 144);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1_1.IndexValueWeightedAverageWithNumberOfSales == 0.6M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization1_1_2.IndexIncome == 96);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1_2.IndexValueWeightedAverageWithNumberOfSales == 0.4M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_1_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);

            Assert.IsTrue(userResourcePoolIndexOrganization2_1_1.IndexIncome == 96);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1_1.IndexValueWeightedAverageWithNumberOfSales == 0.6M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization2_1_2.IndexIncome == 64);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1_2.IndexValueWeightedAverageWithNumberOfSales == 0.4M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_1_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);

            // User 2
            Assert.IsTrue(userResourcePool2.NumberOfSales == 4);
            Assert.IsTrue(userResourcePool2.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool2.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalIncome == 1200);
            Assert.IsTrue(userResourcePool2.TotalProductionCost == 400);
            Assert.IsTrue(userResourcePool2.TotalProfit == 400);
            Assert.IsTrue(userResourcePool2.TotalResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenue == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenueIncludingResourcePoolTax == 1600);

            Assert.IsTrue(userResourcePoolIndex1_2.IndexShare == 480);
            Assert.IsTrue(userResourcePoolIndex1_2.IndexValueWeightedAverageWithNumberOfSales == 2);

            Assert.IsTrue(userResourcePoolIndex2_2.IndexShare == 320);
            Assert.IsTrue(userResourcePoolIndex2_2.IndexValueWeightedAverageWithNumberOfSales == 2);

            Assert.IsTrue(userOrganization2_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalIncome == 680);
            Assert.IsTrue(userOrganization2_1.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_1.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolIncome == 480);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userOrganization2_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalIncome == 520);
            Assert.IsTrue(userOrganization2_2.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_2.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolIncome == 320);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userResourcePoolIndexOrganization1_2_1.IndexIncome == 288);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2_1.IndexValueWeightedAverageWithNumberOfSales == 1.2M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization1_2_2.IndexIncome == 192);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2_2.IndexValueWeightedAverageWithNumberOfSales == 0.8M);
            Assert.IsTrue(userResourcePoolIndexOrganization1_2_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);

            Assert.IsTrue(userResourcePoolIndexOrganization2_2_1.IndexIncome == 192);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2_1.IndexValueWeightedAverageWithNumberOfSales == 1.2M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2_1.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.6M);

            Assert.IsTrue(userResourcePoolIndexOrganization2_2_2.IndexIncome == 128);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2_2.IndexValueWeightedAverageWithNumberOfSales == 0.8M);
            Assert.IsTrue(userResourcePoolIndexOrganization2_2_2.IndexValueWeightedAverageWithNumberOfSalesWeightedAverage == 0.4M);
        }

        [TestMethod]
        public void QualityIndex_TwoUsers_TwoOrganizations()
        {
            var resourcePool = new ResourcePool();

            var sector = new Sector() { ResourcePool = resourcePool };
            resourcePool.SectorSet.Add(sector);

            var organization1 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization1);

            var organization2 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization2);

            var user1 = new User();

            var userResourcePool1 = new UserResourcePool() { User = user1, ResourcePool = resourcePool, ResourcePoolRate = 100, QualityIndexRating = 100 };
            user1.UserResourcePoolSet.Add(userResourcePool1);
            resourcePool.UserResourcePoolSet.Add(userResourcePool1);

            var userOrganization1_1 = new UserOrganization() { User = user1, Organization = organization1, NumberOfSales = 1, QualityRating = 80 };
            user1.UserOrganizationSet.Add(userOrganization1_1);
            organization1.UserOrganizationSet.Add(userOrganization1_1);

            var userOrganization1_2 = new UserOrganization() { User = user1, Organization = organization2, NumberOfSales = 1, QualityRating = 20 };
            user1.UserOrganizationSet.Add(userOrganization1_2);
            organization2.UserOrganizationSet.Add(userOrganization1_2);

            var user2 = new User();

            var userResourcePool2 = new UserResourcePool() { User = user2, ResourcePool = resourcePool, ResourcePoolRate = 100, QualityIndexRating = 100 };
            user2.UserResourcePoolSet.Add(userResourcePool2);
            resourcePool.UserResourcePoolSet.Add(userResourcePool2);

            var userOrganization2_1 = new UserOrganization() { User = user2, Organization = organization1, NumberOfSales = 2, QualityRating = 40 };
            user2.UserOrganizationSet.Add(userOrganization2_1);
            organization1.UserOrganizationSet.Add(userOrganization2_1);

            var userOrganization2_2 = new UserOrganization() { User = user2, Organization = organization2, NumberOfSales = 2, QualityRating = 60 };
            user2.UserOrganizationSet.Add(userOrganization2_2);
            organization2.UserOrganizationSet.Add(userOrganization2_2);

            // Results
            Assert.IsTrue(resourcePool.ProductionCost == 200);
            Assert.IsTrue(resourcePool.Profit == 200);
            Assert.IsTrue(resourcePool.SalesPrice == 400);
            Assert.IsTrue(resourcePool.QualityIndexRatingWeightedAverage == 1);
            Assert.IsTrue(resourcePool.TotalIndexRatingAverage == 100);

            Assert.IsTrue(organization1.Profit == 100);
            Assert.IsTrue(organization2.Profit == 100);

            // User 1
            Assert.IsTrue(userResourcePool1.NumberOfSales == 2);
            Assert.IsTrue(userResourcePool1.QualityIndexValueWeightedAverageWithNumberOfSales == 1);
            Assert.IsTrue(userResourcePool1.QualityIndexRating == 100);
            Assert.IsTrue(userResourcePool1.QualityIndexShare == 400);
            Assert.IsTrue(userResourcePool1.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool1.TotalIncome == 600);
            Assert.IsTrue(userResourcePool1.TotalProductionCost == 200);
            Assert.IsTrue(userResourcePool1.TotalProfit == 200);
            Assert.IsTrue(userResourcePool1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenue == 400);
            Assert.IsTrue(userResourcePool1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userOrganization1_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_1.TotalIncome == 340);
            Assert.IsTrue(userOrganization1_1.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_1.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolIncome == 240);
            Assert.IsTrue(userOrganization1_1.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_1.TotalSalesRevenueIncludingResourcePoolTax == 400);

            Assert.IsTrue(userOrganization1_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization1_2.TotalIncome == 260);
            Assert.IsTrue(userOrganization1_2.TotalProductionCost == 100);
            Assert.IsTrue(userOrganization1_2.TotalProfit == 100);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolIncome == 160);
            Assert.IsTrue(userOrganization1_2.TotalResourcePoolTax == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenue == 200);
            Assert.IsTrue(userOrganization1_2.TotalSalesRevenueIncludingResourcePoolTax == 400);

            // User 2
            Assert.IsTrue(userResourcePool2.NumberOfSales == 4);
            Assert.IsTrue(userResourcePool2.QualityIndexValueWeightedAverageWithNumberOfSales == 2);
            Assert.IsTrue(userResourcePool2.QualityIndexRating == 100);
            Assert.IsTrue(userResourcePool2.QualityIndexShare == 800);
            Assert.IsTrue(userResourcePool2.ResourcePoolTax == 400);
            Assert.IsTrue(userResourcePool2.SalesPriceIncludingResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalIncome == 1200);
            Assert.IsTrue(userResourcePool2.TotalProductionCost == 400);
            Assert.IsTrue(userResourcePool2.TotalProfit == 400);
            Assert.IsTrue(userResourcePool2.TotalResourcePoolTax == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenue == 800);
            Assert.IsTrue(userResourcePool2.TotalSalesRevenueIncludingResourcePoolTax == 1600);

            Assert.IsTrue(userOrganization2_1.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_1.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalIncome == 680);
            Assert.IsTrue(userOrganization2_1.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_1.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolIncome == 480);
            Assert.IsTrue(userOrganization2_1.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_1.TotalSalesRevenueIncludingResourcePoolTax == 800);

            Assert.IsTrue(userOrganization2_2.ResourcePoolTax == 200);
            Assert.IsTrue(userOrganization2_2.SalesPriceIncludingResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalIncome == 520);
            Assert.IsTrue(userOrganization2_2.TotalProductionCost == 200);
            Assert.IsTrue(userOrganization2_2.TotalProfit == 200);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolIncome == 320);
            Assert.IsTrue(userOrganization2_2.TotalResourcePoolTax == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenue == 400);
            Assert.IsTrue(userOrganization2_2.TotalSalesRevenueIncludingResourcePoolTax == 800);
        }

        /// <summary>
        /// There was an issue with index rating weighted average calculation but it's fixed now / SH - 24 Jun. '14
        /// </summary>
        [TestMethod]
        public void QualityIndex_TwoUsers_TwoOrganizations_BugHunt()
        {
            var resourcePool = new ResourcePool();

            var sector = new Sector() { ResourcePool = resourcePool };
            resourcePool.SectorSet.Add(sector);

            var organization1 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization1);

            var organization2 = new Organization() { Sector = sector, ProductionCost = 100, SalesPrice = 200 };
            sector.OrganizationSet.Add(organization2);

            var user1 = new User();

            var userResourcePool1 = new UserResourcePool() { User = user1, ResourcePool = resourcePool, ResourcePoolRate = 100, QualityIndexRating = 75, EmployeeSatisfactionIndexRating = 25 };
            user1.UserResourcePoolSet.Add(userResourcePool1);
            resourcePool.UserResourcePoolSet.Add(userResourcePool1);

            var userOrganization1_1 = new UserOrganization() { User = user1, Organization = organization1, NumberOfSales = 1, QualityRating = 80 };
            user1.UserOrganizationSet.Add(userOrganization1_1);
            organization1.UserOrganizationSet.Add(userOrganization1_1);

            var userOrganization1_2 = new UserOrganization() { User = user1, Organization = organization2, NumberOfSales = 1, QualityRating = 20 };
            user1.UserOrganizationSet.Add(userOrganization1_2);
            organization2.UserOrganizationSet.Add(userOrganization1_2);

            var user2 = new User();

            var userResourcePool2 = new UserResourcePool() { User = user2, ResourcePool = resourcePool, ResourcePoolRate = 100, QualityIndexRating = 50, EmployeeSatisfactionIndexRating = 50 };
            user2.UserResourcePoolSet.Add(userResourcePool2);
            resourcePool.UserResourcePoolSet.Add(userResourcePool2);

            var userOrganization2_1 = new UserOrganization() { User = user2, Organization = organization1, NumberOfSales = 2, QualityRating = 40 };
            user2.UserOrganizationSet.Add(userOrganization2_1);
            organization1.UserOrganizationSet.Add(userOrganization2_1);

            var userOrganization2_2 = new UserOrganization() { User = user2, Organization = organization2, NumberOfSales = 2, QualityRating = 60 };
            user2.UserOrganizationSet.Add(userOrganization2_2);
            organization2.UserOrganizationSet.Add(userOrganization2_2);

            // Results
            Assert.IsTrue(resourcePool.QualityIndexRatingWeightedAverage == 0.625M);
            Assert.IsTrue(resourcePool.EmployeeSatisfactionIndexRatingWeightedAverage == 0.375M);
        }
    }
}
