namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Migrations;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;

    public static class DatabaseInitializer
    {
        static ResourcePoolRepository resourcePoolRepository = null;
        static ElementRepository elementRepository = null;
        static ElementFieldRepository elementFieldRepository = null;
        static ElementItemRepository elementItemRepository = null;
        static ElementCellRepository elementCellRepository = null;
        static ResourcePoolIndexRepository resourcePoolIndexRepository = null;
        static UserResourcePoolRepository userResourcePoolRepository = null;
        static UserResourcePoolIndexRepository userResourcePoolIndexRepository = null;
        static UserElementCellRepository userElementCellRepository = null;

        public static void Initialize(bool liveDatabase = true)
        {
            var initializer = liveDatabase
                ? (IDatabaseInitializer<WealthEconomyContext>)new MigrateDatabaseToLatestVersion<WealthEconomyContext, Configuration>()
                : (IDatabaseInitializer<WealthEconomyContext>)new DropCreateDatabaseAlways();

            Database.SetInitializer(initializer);
        }

        public static void SeedInitialData(WealthEconomyContext context)
        {
            // Managers & stores & repositories
            var roleStore = new RoleStore(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            var userStore = new UserStore(context);
            userStore.AutoSaveChanges = true;
            var userManager = new UserManager<User, int>(userStore);

            resourcePoolRepository = new ResourcePoolRepository(context);
            elementRepository = new ElementRepository(context);
            elementFieldRepository = new ElementFieldRepository(context);
            elementItemRepository = new ElementItemRepository(context);
            elementCellRepository = new ElementCellRepository(context);
            resourcePoolIndexRepository = new ResourcePoolIndexRepository(context);
            userResourcePoolRepository = new UserResourcePoolRepository(context);
            userResourcePoolIndexRepository = new UserResourcePoolIndexRepository(context);
            userElementCellRepository = new UserElementCellRepository(context);

            // Admin role
            var adminRole = new Role("Administrator");
            roleManager.Create(adminRole);

            // Admin user
            var adminUser = new User() { UserName = "admin", Email = "admin" };
            var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(adminUser, adminUserPassword);
            userManager.AddToRole(adminUser.Id, "Administrator");

            // Sample user
            var sampleUser = new User() { UserName = "sample", Email = "sample" };
            var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(sampleUser, sampleUserPassword);

            // Samples
            AddSectorIndexSample(sampleUser);
            //AddKnowledgeIndexSample(sampleUser);
            //AddTotalCostIndexSample(sampleUser);

            // TODO Update these with dynamic indexes!
            //AddQualityIndexSample(sampleUser);
            //AddEmployeeSatisfactionIndexSample(sampleUser);
            //AddCustomerSatisfactionIndexSample(sampleUser);
            //AddAllInOneSample(sampleUser);

            context.SaveChanges();
        }

        static void AddSectorIndexSample(User user)
        {
            var sectorResourcePool = new ResourcePool() { Name = "Sector Index Sample", IsSample = true };
            
            var sectorElement = new Element() { ResourcePool = sectorResourcePool, Name = "Sector", IsMainElement = true };
            var sectorNameField = new ElementField() { Element = sectorElement, Name = "Name", ElementFieldType = (byte)ElementFieldType.String };
            var sectorSalesPriceField = new ElementField() { Element = sectorElement, Name = "Sales Price", ElementFieldType = (byte)ElementFieldType.ResourcePool };
            var sectorSalesNumberField = new ElementField() { Element = sectorElement, Name = "Sales Number", ElementFieldType = (byte)ElementFieldType.Multiplier };
            
            var sectorItem1 = new ElementItem() { Element = sectorElement, Name = "Basic Materials Sector" };
            var sectorItem2 = new ElementItem() { Element = sectorElement, Name = "Conglomerates Sector" };
            var sectorItem3 = new ElementItem() { Element = sectorElement, Name = "Consumer Goods Sector" };
            var sectorItem4 = new ElementItem() { Element = sectorElement, Name = "Financial Sector" };
            var sectorItem5 = new ElementItem() { Element = sectorElement, Name = "Healthcare Sector" };
            var sectorItem6 = new ElementItem() { Element = sectorElement, Name = "Industrial Goods Sector" };
            var sectorItem7 = new ElementItem() { Element = sectorElement, Name = "Services Sector" };
            var sectorItem8 = new ElementItem() { Element = sectorElement, Name = "Technology Sector" };
            var sectorItem9 = new ElementItem() { Element = sectorElement, Name = "Utilities Sector" };

            var sectorNameCell1 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem1, StringValue = "Basic Materials" };
            var sectorNameCell2 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem2, StringValue = "Conglomerates" };
            var sectorNameCell3 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem3, StringValue = "Consumer Goods" };
            var sectorNameCell4 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem4, StringValue = "Financial" };
            var sectorNameCell5 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem5, StringValue = "Healthcare" };
            var sectorNameCell6 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem6, StringValue = "Industrial Goods" };
            var sectorNameCell7 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem7, StringValue = "Services" };
            var sectorNameCell8 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem8, StringValue = "Technology" };
            var sectorNameCell9 = new ElementCell() { ElementField = sectorNameField, ElementItem = sectorItem9, StringValue = "Utilities" };

            var sectorSalesPriceCell1 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem1, DecimalValue = 150 };
            var sectorSalesPriceCell2 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem2, DecimalValue = 150 };
            var sectorSalesPriceCell3 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem3, DecimalValue = 150 };
            var sectorSalesPriceCell4 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem4, DecimalValue = 150 };
            var sectorSalesPriceCell5 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem5, DecimalValue = 150 };
            var sectorSalesPriceCell6 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem6, DecimalValue = 150 };
            var sectorSalesPriceCell7 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem7, DecimalValue = 150 };
            var sectorSalesPriceCell8 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem8, DecimalValue = 150 };
            var sectorSalesPriceCell9 = new ElementCell() { ElementField = sectorSalesPriceField, ElementItem = sectorItem9, DecimalValue = 150 };

            var sectorSalesNumberCell1 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem1, DecimalValue = 0 };
            var sectorSalesNumberCell2 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem2, DecimalValue = 0 };
            var sectorSalesNumberCell3 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem3, DecimalValue = 0 };
            var sectorSalesNumberCell4 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem4, DecimalValue = 0 };
            var sectorSalesNumberCell5 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem5, DecimalValue = 0 };
            var sectorSalesNumberCell6 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem6, DecimalValue = 0 };
            var sectorSalesNumberCell7 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem7, DecimalValue = 0 };
            var sectorSalesNumberCell8 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem8, DecimalValue = 0 };
            var sectorSalesNumberCell9 = new ElementCell() { ElementField = sectorSalesNumberField, ElementItem = sectorItem9, DecimalValue = 0 };

            // Importance Index
            // TODO Will be updated with new field / index combo
            var sectorImportanceIndex = new ResourcePoolIndex() { ResourcePool = sectorResourcePool, Name = "Importance Index", ElementField = sectorNameField, RatingSortType = (byte)RatingSortType.HighestToLowest };

            var userResourcePool = new UserResourcePool() { User = user, ResourcePool = sectorResourcePool };
            var userResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = userResourcePool, Rating = 101 };
            var userImportanceIndexValue1 = new UserElementCell() { User = user, ElementCell = sectorNameCell1, Rating = 12 };
            var userImportanceIndexValue2 = new UserElementCell() { User = user, ElementCell = sectorNameCell2, Rating = 11 };
            var userImportanceIndexValue3 = new UserElementCell() { User = user, ElementCell = sectorNameCell3, Rating = 11 };
            var userImportanceIndexValue4 = new UserElementCell() { User = user, ElementCell = sectorNameCell4, Rating = 11 };
            var userImportanceIndexValue5 = new UserElementCell() { User = user, ElementCell = sectorNameCell5, Rating = 11 };
            var userImportanceIndexValue6 = new UserElementCell() { User = user, ElementCell = sectorNameCell6, Rating = 11 };
            var userImportanceIndexValue7 = new UserElementCell() { User = user, ElementCell = sectorNameCell7, Rating = 11 };
            var userImportanceIndexValue8 = new UserElementCell() { User = user, ElementCell = sectorNameCell8, Rating = 11 };
            var userImportanceIndexValue9 = new UserElementCell() { User = user, ElementCell = sectorNameCell9, Rating = 11 };

            // Inserts
            resourcePoolRepository.Insert(sectorResourcePool);

            elementRepository.Insert(sectorElement);
            elementFieldRepository.Insert(sectorNameField);
            elementFieldRepository.Insert(sectorSalesPriceField);
            elementFieldRepository.Insert(sectorSalesNumberField);

            elementItemRepository.Insert(sectorItem1);
            elementItemRepository.Insert(sectorItem2);
            elementItemRepository.Insert(sectorItem3);
            elementItemRepository.Insert(sectorItem4);
            elementItemRepository.Insert(sectorItem5);
            elementItemRepository.Insert(sectorItem6);
            elementItemRepository.Insert(sectorItem7);
            elementItemRepository.Insert(sectorItem8);
            elementItemRepository.Insert(sectorItem9);

            elementCellRepository.Insert(sectorNameCell1);
            elementCellRepository.Insert(sectorNameCell2);
            elementCellRepository.Insert(sectorNameCell3);
            elementCellRepository.Insert(sectorNameCell4);
            elementCellRepository.Insert(sectorNameCell5);
            elementCellRepository.Insert(sectorNameCell6);
            elementCellRepository.Insert(sectorNameCell7);
            elementCellRepository.Insert(sectorNameCell8);
            elementCellRepository.Insert(sectorNameCell9);

            elementCellRepository.Insert(sectorSalesPriceCell1);
            elementCellRepository.Insert(sectorSalesPriceCell2);
            elementCellRepository.Insert(sectorSalesPriceCell3);
            elementCellRepository.Insert(sectorSalesPriceCell4);
            elementCellRepository.Insert(sectorSalesPriceCell5);
            elementCellRepository.Insert(sectorSalesPriceCell6);
            elementCellRepository.Insert(sectorSalesPriceCell7);
            elementCellRepository.Insert(sectorSalesPriceCell8);
            elementCellRepository.Insert(sectorSalesPriceCell9);

            elementCellRepository.Insert(sectorSalesNumberCell1);
            elementCellRepository.Insert(sectorSalesNumberCell2);
            elementCellRepository.Insert(sectorSalesNumberCell3);
            elementCellRepository.Insert(sectorSalesNumberCell4);
            elementCellRepository.Insert(sectorSalesNumberCell5);
            elementCellRepository.Insert(sectorSalesNumberCell6);
            elementCellRepository.Insert(sectorSalesNumberCell7);
            elementCellRepository.Insert(sectorSalesNumberCell8);
            elementCellRepository.Insert(sectorSalesNumberCell9);

            resourcePoolIndexRepository.Insert(sectorImportanceIndex);

            userResourcePoolRepository.Insert(userResourcePool);
            userResourcePoolIndexRepository.Insert(userResourcePoolIndex);
            userElementCellRepository.Insert(userImportanceIndexValue1);
            userElementCellRepository.Insert(userImportanceIndexValue2);
            userElementCellRepository.Insert(userImportanceIndexValue3);
            userElementCellRepository.Insert(userImportanceIndexValue4);
            userElementCellRepository.Insert(userImportanceIndexValue5);
            userElementCellRepository.Insert(userImportanceIndexValue6);
            userElementCellRepository.Insert(userImportanceIndexValue7);
            userElementCellRepository.Insert(userImportanceIndexValue8);
            userElementCellRepository.Insert(userImportanceIndexValue9);

            //var sectorImportanceIndex = new ResourcePoolIndex() { ResourcePool = sectorResourcePool, Name = "Sector Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, RatingSortType = (byte)RatingSortType.HighestToLowest };
            //var sectorOrganization1 = new Organization() { ResourcePool = sectorResourcePool, Name = "Basic Materials", SalesPrice = 150 };
            //var sectorOrganization2 = new Organization() { ResourcePool = sectorResourcePool, Name = "Conglomerates", SalesPrice = 150 };
            //var sectorOrganization3 = new Organization() { ResourcePool = sectorResourcePool, Name = "Consumer Goods", SalesPrice = 150 };
            //var sectorOrganization4 = new Organization() { ResourcePool = sectorResourcePool, Name = "Financial", SalesPrice = 150 };
            //var sectorOrganization5 = new Organization() { ResourcePool = sectorResourcePool, Name = "Healthcare", SalesPrice = 150 };
            //var sectorOrganization6 = new Organization() { ResourcePool = sectorResourcePool, Name = "Industrial Goods", SalesPrice = 150 };
            //var sectorOrganization7 = new Organization() { ResourcePool = sectorResourcePool, Name = "Services", SalesPrice = 150 };
            //var sectorOrganization8 = new Organization() { ResourcePool = sectorResourcePool, Name = "Technology", SalesPrice = 150 };
            //var sectorOrganization9 = new Organization() { ResourcePool = sectorResourcePool, Name = "Utilities", SalesPrice = 150 };
            //var sectorUserResourcePool = new UserResourcePool() { User = user, ResourcePool = sectorResourcePool, ResourcePoolRate = 101 };
            //var sectorUserResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = sectorUserResourcePool, ResourcePoolIndex = sectorImportanceIndex, Rating = 100 };
            //var sectorUserResourcePoolIndexValue1 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization1, Rating = 12 };
            //var sectorUserResourcePoolIndexValue2 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization2, Rating = 11 };
            //var sectorUserResourcePoolIndexValue3 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization3, Rating = 11 };
            //var sectorUserResourcePoolIndexValue4 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization4, Rating = 11 };
            //var sectorUserResourcePoolIndexValue5 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization5, Rating = 11 };
            //var sectorUserResourcePoolIndexValue6 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization6, Rating = 11 };
            //var sectorUserResourcePoolIndexValue7 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization7, Rating = 11 };
            //var sectorUserResourcePoolIndexValue8 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization8, Rating = 11 };
            //var sectorUserResourcePoolIndexValue9 = new UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization9, Rating = 11 };
            //var sectorUserOrganization1 = new UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0 };
            //var sectorUserOrganization2 = new UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0 };
            //var sectorUserOrganization3 = new UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0 };
            //var sectorUserOrganization4 = new UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0 };
            //var sectorUserOrganization5 = new UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0 };
            //var sectorUserOrganization6 = new UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0 };
            //var sectorUserOrganization7 = new UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0 };
            //var sectorUserOrganization8 = new UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0 };
            //var sectorUserOrganization9 = new UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0 };

            //ResourcePoolRepository.Insert(sectorResourcePool);
            //ResourcePoolIndexRepository.Insert(sectorImportanceIndex);
            //OrganizationRepository.Insert(sectorOrganization1);
            //OrganizationRepository.Insert(sectorOrganization2);
            //OrganizationRepository.Insert(sectorOrganization3);
            //OrganizationRepository.Insert(sectorOrganization4);
            //OrganizationRepository.Insert(sectorOrganization5);
            //OrganizationRepository.Insert(sectorOrganization6);
            //OrganizationRepository.Insert(sectorOrganization7);
            //OrganizationRepository.Insert(sectorOrganization8);
            //OrganizationRepository.Insert(sectorOrganization9);
            //UserResourcePoolRepository.Insert(sectorUserResourcePool);
            //UserResourcePoolIndexRepository.Insert(sectorUserResourcePoolIndex);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue1);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue2);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue3);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue4);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue5);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue6);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue7);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue8);
            //UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue9);
            //UserOrganizationRepository.Insert(sectorUserOrganization1);
            //UserOrganizationRepository.Insert(sectorUserOrganization2);
            //UserOrganizationRepository.Insert(sectorUserOrganization3);
            //UserOrganizationRepository.Insert(sectorUserOrganization4);
            //UserOrganizationRepository.Insert(sectorUserOrganization5);
            //UserOrganizationRepository.Insert(sectorUserOrganization6);
            //UserOrganizationRepository.Insert(sectorUserOrganization7);
            //UserOrganizationRepository.Insert(sectorUserOrganization8);
            //UserOrganizationRepository.Insert(sectorUserOrganization9);
        }

        //void AddKnowledgeIndexSample(User user)
        //{
        //    // Update this with DynamicFieldIndex type

        //    var knowledgeResourcePool = new ResourcePool() { Name = "Knowledge Index Sample", IsSample = true };
        //    var knowledgeLicenseElement = new Element() { ResourcePool = knowledgeResourcePool, Name = "License" };
        //    var knowledgeLicenseItem1 = new ElementItem() { Element = knowledgeLicenseElement, Name = "Open License" };
        //    var knowledgeLicenseItem2 = new ElementItem() { Element = knowledgeLicenseElement, Name = "Restricted License" };
        //    var knowledgeResourcePoolIndex = new ResourcePoolIndex() { ResourcePool = knowledgeResourcePool, Name = "Knowledge Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, Element = knowledgeLicenseElement, RatingSortType = (byte)RatingSortType.LowestToHighest };
        //    var knowledgeOrganization1 = new Organization() { ResourcePool = knowledgeResourcePool, Name = "True Source", SalesPrice = 150 };
        //    var knowledgeOrganizationLicenseItem1 = new OrganizationElementItem() { Organization = knowledgeOrganization1, ElementItem = knowledgeLicenseItem1 };
        //    var knowledgeOrganization2 = new Organization() { ResourcePool = knowledgeResourcePool, Name = "Hidden Knowledge", SalesPrice = 150 };
        //    var knowledgeOrganizationLicenseItem2 = new OrganizationElementItem() { Organization = knowledgeOrganization2, ElementItem = knowledgeLicenseItem2 };
        //    var knowledgeUserResourcePool = new UserResourcePool() { User = user, ResourcePool = knowledgeResourcePool, ResourcePoolRate = 101 };
        //    var knowledgeUserResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = knowledgeUserResourcePool, ResourcePoolIndex = knowledgeResourcePoolIndex, Rating = 100 };
        //    var knowledgeUserLicenseItemRating1 = new UserElementItem() { User = user, ElementItem = knowledgeLicenseItem1, Rating = 75 };
        //    var knowledgeUserLicenseItemRating2 = new UserElementItem() { User = user, ElementItem = knowledgeLicenseItem2, Rating = 25 };
        //    var knowledgeUserOrganization1 = new UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0 };
        //    var knowledgeUserOrganization2 = new UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(knowledgeResourcePool);
        //    ElementRepository.Insert(knowledgeLicenseElement);
        //    ElementItemRepository.Insert(knowledgeLicenseItem1);
        //    ElementItemRepository.Insert(knowledgeLicenseItem2);
        //    ResourcePoolIndexRepository.Insert(knowledgeResourcePoolIndex);
        //    OrganizationRepository.Insert(knowledgeOrganization1);
        //    OrganizationElementItemRepository.Insert(knowledgeOrganizationLicenseItem1);
        //    OrganizationRepository.Insert(knowledgeOrganization2);
        //    OrganizationElementItemRepository.Insert(knowledgeOrganizationLicenseItem2);
        //    UserResourcePoolRepository.Insert(knowledgeUserResourcePool);
        //    UserResourcePoolIndexRepository.Insert(knowledgeUserResourcePoolIndex);
        //    UserElementItemRepository.Insert(knowledgeUserLicenseItemRating1);
        //    UserElementItemRepository.Insert(knowledgeUserLicenseItemRating2);
        //    UserOrganizationRepository.Insert(knowledgeUserOrganization1);
        //    UserOrganizationRepository.Insert(knowledgeUserOrganization2);
        //}

        //void AddTotalCostIndexSample(User user)
        //{
        //    // TODO Update this with Dynamic Field Index
        //    var totalCostResourcePool = new ResourcePool() { Name = "Total Cost Index Sample", IsSample = true };
        //    var totalCostResourcePoolIndex = new ResourcePoolIndex() { ResourcePool = totalCostResourcePool, Name = "Total Cost Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, RatingSortType = (byte)RatingSortType.LowestToHighest };
        //    var totalCostOrganization1 = new Organization() { ResourcePool = totalCostResourcePool, Name = "Lowlands", SalesPrice = 125 };
        //    var totalCostOrganization2 = new Organization() { ResourcePool = totalCostResourcePool, Name = "High Coast", SalesPrice = 175 };
        //    var totalCostUserResourcePool = new UserResourcePool() { User = user, ResourcePool = totalCostResourcePool, ResourcePoolRate = 101 };
        //    var totalCostUserResourcePoolIndex = new UserResourcePoolIndex() { UserResourcePool = totalCostUserResourcePool, ResourcePoolIndex = totalCostResourcePoolIndex, Rating = 100 };
        //    var totalCostUserOrganization1 = new UserOrganization() { User = user, Organization = totalCostOrganization1, NumberOfSales = 0 };
        //    var totalCostUserOrganization2 = new UserOrganization() { User = user, Organization = totalCostOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(totalCostResourcePool);
        //    ResourcePoolIndexRepository.Insert(totalCostResourcePoolIndex);
        //    OrganizationRepository.Insert(totalCostOrganization1);
        //    OrganizationRepository.Insert(totalCostOrganization2);
        //    UserResourcePoolRepository.Insert(totalCostUserResourcePool);
        //    UserResourcePoolIndexRepository.Insert(totalCostUserResourcePoolIndex);
        //    UserOrganizationRepository.Insert(totalCostUserOrganization1);
        //    UserOrganizationRepository.Insert(totalCostUserOrganization2);
        //}

        // TODO Update these samples
        //void AddQualityIndexSample(User user)
        //{
        //    var qualityResourcePool = new ResourcePool() { Name = "Quality Index Sample", IsSample = true };
        //    var qualityOrganization1 = new Organization() { ResourcePool = qualityResourcePool, Name = "Wealth's Finest", SalesPrice = 150 };
        //    var qualityOrganization2 = new Organization() { ResourcePool = qualityResourcePool, Name = "Poor Beggar", SalesPrice = 150 };
        //    var qualityUserResourcePool = new UserResourcePool() { User = user, ResourcePool = qualityResourcePool, ResourcePoolRate = 101 };
        //    var qualityUserOrganization1 = new UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0 };
        //    var qualityUserOrganization2 = new UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(qualityResourcePool);
        //    OrganizationRepository.Insert(qualityOrganization1);
        //    OrganizationRepository.Insert(qualityOrganization2);
        //    UserResourcePoolRepository.Insert(qualityUserResourcePool);
        //    UserOrganizationRepository.Insert(qualityUserOrganization1);
        //    UserOrganizationRepository.Insert(qualityUserOrganization2);
        //}

        //void AddEmployeeSatisfactionIndexSample(User user)
        //{
        //    var employeeResourcePool = new ResourcePool() { Name = "Employee Satisfaction Index Sample", IsSample = true };
        //    var employeeOrganization1 = new Organization() { ResourcePool = employeeResourcePool, Name = "One Big Family", SalesPrice = 150 };
        //    var employeeOrganization2 = new Organization() { ResourcePool = employeeResourcePool, Name = "Reckless Ones", SalesPrice = 150 };
        //    var employeeUserResourcePool = new UserResourcePool() { User = user, ResourcePool = employeeResourcePool, ResourcePoolRate = 101 };
        //    var employeeUserOrganization1 = new UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0 };
        //    var employeeUserOrganization2 = new UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(employeeResourcePool);
        //    OrganizationRepository.Insert(employeeOrganization1);
        //    OrganizationRepository.Insert(employeeOrganization2);
        //    UserResourcePoolRepository.Insert(employeeUserResourcePool);
        //    UserOrganizationRepository.Insert(employeeUserOrganization1);
        //    UserOrganizationRepository.Insert(employeeUserOrganization2);
        //}

        //void AddCustomerSatisfactionIndexSample(User user)
        //{
        //    var customerResourcePool = new ResourcePool() { Name = "Customer Satisfaction Index Sample", IsSample = true };
        //    var customerOrganization1 = new Organization() { ResourcePool = customerResourcePool, Name = "Friendly Faieries", SalesPrice = 150 };
        //    var customerOrganization2 = new Organization() { ResourcePool = customerResourcePool, Name = "Clumsy Clowns", SalesPrice = 150 };
        //    var customerUserResourcePool = new UserResourcePool() { User = user, ResourcePool = customerResourcePool, ResourcePoolRate = 101 };
        //    var customerUserOrganization1 = new UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0 };
        //    var customerUserOrganization2 = new UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(customerResourcePool);
        //    OrganizationRepository.Insert(customerOrganization1);
        //    OrganizationRepository.Insert(customerOrganization2);
        //    UserResourcePoolRepository.Insert(customerUserResourcePool);
        //    UserOrganizationRepository.Insert(customerUserOrganization1);
        //    UserOrganizationRepository.Insert(customerUserOrganization2);
        //}

        //void AddAllInOneSample(User user)
        //{
        //    // TODO Add dynamic indexes and update index ratings

        //    var allInOneResourcePool = new ResourcePool() { Name = "All in One Sample", IsSample = true };
        //    var allInOneUserResourcePool = new UserResourcePool() { User = user, ResourcePool = allInOneResourcePool, ResourcePoolRate = 101 };

        //    // Total Cost
        //    var allInOneTotalCostOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Lowlands", SalesPrice = 125 };
        //    var allInOneTotalCostOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "High Coast", SalesPrice = 175 };
        //    var allInOneUserTotalCostOrganization1 = new UserOrganization() { User = user, Organization = allInOneTotalCostOrganization1, NumberOfSales = 0 };
        //    var allInOneUserTotalCostOrganization2 = new UserOrganization() { User = user, Organization = allInOneTotalCostOrganization2, NumberOfSales = 0 };

        //    // Knowledge
        //    // TODO
        //    var knowledgeOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "True Source", SalesPrice = 150 };
        //    var knowledgeOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Hidden Knowledge", SalesPrice = 150 };
        //    var knowledgeUserOrganization1 = new UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0 };
        //    var knowledgeUserOrganization2 = new UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0 };


        //    // Quality
        //    var qualityOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Wealth's Finest", SalesPrice = 150 };
        //    var qualityOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Poor Beggar", SalesPrice = 150 };
        //    var qualityUserOrganization1 = new UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0 };
        //    var qualityUserOrganization2 = new UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0 };

        //    // Employee
        //    var employeeOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "One Big Family", SalesPrice = 150 };
        //    var employeeOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Reckless Ones", SalesPrice = 150 };
        //    var employeeUserOrganization1 = new UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0 };
        //    var employeeUserOrganization2 = new UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0 };

        //    // Customer
        //    var customerOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Friendly Faieries", SalesPrice = 150 };
        //    var customerOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Clumsy Clowns", SalesPrice = 150 };
        //    var customerUserOrganization1 = new UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0 };
        //    var customerUserOrganization2 = new UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0 };

        //    // Sector
        //    var sectorOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Basic Materials", SalesPrice = 150 };
        //    var sectorOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Conglomerates", SalesPrice = 150 };
        //    var sectorOrganization3 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Consumer Goods", SalesPrice = 150 };
        //    var sectorOrganization4 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Financial", SalesPrice = 150 };
        //    var sectorOrganization5 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Healthcare", SalesPrice = 150 };
        //    var sectorOrganization6 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Industrial Goods", SalesPrice = 150 };
        //    var sectorOrganization7 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Services", SalesPrice = 150 };
        //    var sectorOrganization8 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Technology", SalesPrice = 150 };
        //    var sectorOrganization9 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Utilities", SalesPrice = 150 };
        //    // TODO Sector Index ratings
        //    //var sectorUserSectorRating1 = new UserSectorRating() { User = user, Sector = sectorSector1, Rating = 12 };
        //    //var sectorUserSectorRating2 = new UserSectorRating() { User = user, Sector = sectorSector2, Rating = 11 };
        //    //var sectorUserSectorRating3 = new UserSectorRating() { User = user, Sector = sectorSector3, Rating = 11 };
        //    //var sectorUserSectorRating4 = new UserSectorRating() { User = user, Sector = sectorSector4, Rating = 11 };
        //    //var sectorUserSectorRating5 = new UserSectorRating() { User = user, Sector = sectorSector5, Rating = 11 };
        //    //var sectorUserSectorRating6 = new UserSectorRating() { User = user, Sector = sectorSector6, Rating = 11 };
        //    //var sectorUserSectorRating7 = new UserSectorRating() { User = user, Sector = sectorSector7, Rating = 11 };
        //    //var sectorUserSectorRating8 = new UserSectorRating() { User = user, Sector = sectorSector8, Rating = 11 };
        //    //var sectorUserSectorRating9 = new UserSectorRating() { User = user, Sector = sectorSector9, Rating = 11 };
        //    var sectorUserOrganization1 = new UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0 };
        //    var sectorUserOrganization2 = new UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0 };
        //    var sectorUserOrganization3 = new UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0 };
        //    var sectorUserOrganization4 = new UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0 };
        //    var sectorUserOrganization5 = new UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0 };
        //    var sectorUserOrganization6 = new UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0 };
        //    var sectorUserOrganization7 = new UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0 };
        //    var sectorUserOrganization8 = new UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0 };
        //    var sectorUserOrganization9 = new UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0 };

        //    // Distance
        //    var distanceOrganization1 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Home", SalesPrice = 150 };
        //    var distanceOrganization2 = new Organization() { ResourcePool = allInOneResourcePool, Name = "Far Far Away Galaxy", SalesPrice = 150 };
        //    var distanceUserOrganization1 = new UserOrganization() { User = user, Organization = distanceOrganization1, NumberOfSales = 0 };
        //    var distanceUserOrganization2 = new UserOrganization() { User = user, Organization = distanceOrganization2, NumberOfSales = 0 };

        //    // Insert
        //    ResourcePoolRepository.Insert(allInOneResourcePool);
        //    UserResourcePoolRepository.Insert(allInOneUserResourcePool);

        //    OrganizationRepository.Insert(allInOneTotalCostOrganization1);
        //    OrganizationRepository.Insert(allInOneTotalCostOrganization2);
        //    UserOrganizationRepository.Insert(allInOneUserTotalCostOrganization1);
        //    UserOrganizationRepository.Insert(allInOneUserTotalCostOrganization2);

        //    OrganizationRepository.Insert(knowledgeOrganization1);
        //    OrganizationRepository.Insert(knowledgeOrganization2);
        //    UserOrganizationRepository.Insert(knowledgeUserOrganization1);
        //    UserOrganizationRepository.Insert(knowledgeUserOrganization2);

        //    OrganizationRepository.Insert(qualityOrganization1);
        //    OrganizationRepository.Insert(qualityOrganization2);
        //    UserOrganizationRepository.Insert(qualityUserOrganization1);
        //    UserOrganizationRepository.Insert(qualityUserOrganization2);

        //    OrganizationRepository.Insert(employeeOrganization1);
        //    OrganizationRepository.Insert(employeeOrganization2);
        //    UserOrganizationRepository.Insert(employeeUserOrganization1);
        //    UserOrganizationRepository.Insert(employeeUserOrganization2);

        //    OrganizationRepository.Insert(customerOrganization1);
        //    OrganizationRepository.Insert(customerOrganization2);
        //    UserOrganizationRepository.Insert(customerUserOrganization1);
        //    UserOrganizationRepository.Insert(customerUserOrganization2);

        //    OrganizationRepository.Insert(sectorOrganization1);
        //    OrganizationRepository.Insert(sectorOrganization2);
        //    OrganizationRepository.Insert(sectorOrganization3);
        //    OrganizationRepository.Insert(sectorOrganization4);
        //    OrganizationRepository.Insert(sectorOrganization5);
        //    OrganizationRepository.Insert(sectorOrganization6);
        //    OrganizationRepository.Insert(sectorOrganization7);
        //    OrganizationRepository.Insert(sectorOrganization8);
        //    OrganizationRepository.Insert(sectorOrganization9);
        //    UserOrganizationRepository.Insert(sectorUserOrganization1);
        //    UserOrganizationRepository.Insert(sectorUserOrganization2);
        //    UserOrganizationRepository.Insert(sectorUserOrganization3);
        //    UserOrganizationRepository.Insert(sectorUserOrganization4);
        //    UserOrganizationRepository.Insert(sectorUserOrganization5);
        //    UserOrganizationRepository.Insert(sectorUserOrganization6);
        //    UserOrganizationRepository.Insert(sectorUserOrganization7);
        //    UserOrganizationRepository.Insert(sectorUserOrganization8);
        //    UserOrganizationRepository.Insert(sectorUserOrganization9);

        //    OrganizationRepository.Insert(distanceOrganization1);
        //    OrganizationRepository.Insert(distanceOrganization2);
        //    UserOrganizationRepository.Insert(distanceUserOrganization1);
        //    UserOrganizationRepository.Insert(distanceUserOrganization2);
        //}

    }
}
