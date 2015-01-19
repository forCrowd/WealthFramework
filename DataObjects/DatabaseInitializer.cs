namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Migrations;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;

    public static class DatabaseInitializer
    {
        //static ResourcePoolRepository resourcePoolRepository = null;
        //static ElementRepository elementRepository = null;
        //static ElementFieldRepository elementFieldRepository = null;
        //static ElementItemRepository elementItemRepository = null;
        //static ElementCellRepository elementCellRepository = null;
        //static ResourcePoolIndexRepository resourcePoolIndexRepository = null;
        //static UserResourcePoolRepository userResourcePoolRepository = null;
        //static UserResourcePoolIndexRepository userResourcePoolIndexRepository = null;
        //static UserElementCellRepository userElementCellRepository = null;

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

            var resourcePoolRepository = new ResourcePoolRepository(context);

            // Admin role
            var adminRole = new Role("Administrator");
            roleManager.Create(adminRole);

            // Admin user
            var adminUser = new User("admin");
            var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(adminUser, adminUserPassword);
            userManager.AddToRole(adminUser.Id, "Administrator");

            // Sample user
            var sampleUser = new User("sample");
            var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
            userManager.Create(sampleUser, sampleUserPassword);

            // Sample resource pools
            resourcePoolRepository.Insert(resourcePoolRepository.CreateUPOSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateBasicsExistingSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateBasicsNewSystemSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateSectorIndexSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateKnowledgeIndexSample(sampleUser));
            resourcePoolRepository.Insert(resourcePoolRepository.CreateTotalCostIndexSample(sampleUser));

            // Save
            context.SaveChanges();
        }

        //static void AddSectorIndexSample(User user)
        //{
        //    // Resource pool
        //    var sectorResourcePool = new ResourcePool() { Name = "Sector Index Sample", IsSample = true };
            
        //    // Main element
        //    var sectorElement = new Element() { Name = "Sector", IsMainElement = true };
        //    sectorResourcePool.AddElement(sectorElement);

        //    // Fields
        //    var sectorNameField = new ElementField() { Name = "Name", ElementFieldType = (byte)ElementFieldType.String };
        //    var sectorSalesPriceField = new ElementField() { Name = "Sales Price", ElementFieldType = (byte)ElementFieldType.ResourcePool };
        //    var sectorSalesNumberField = new ElementField() { Name = "Sales Number", ElementFieldType = (byte)ElementFieldType.Multiplier };

        //    sectorElement
        //        .AddField(sectorNameField)
        //        .AddField(sectorSalesPriceField)
        //        .AddField(sectorSalesNumberField);

        //    // Importance Index
        //    // TODO Will be updated with new field / index combo
        //    sectorResourcePool.AddIndex(new ResourcePoolIndex() { Name = "Importance Index", ElementField = sectorNameField, RatingSortType = (byte)RatingSortType.HighestToLowest });

        //    // Items, cell, user cells
        //    sectorElement
        //        .AddItem(new ElementItem() { Name = "Basic Materials Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Basic Materials" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 12 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Conglomerates Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Conglomerates" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Consumer Goods Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Consumer Goods" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Financial Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Financial" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Healthcare Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Healthcare" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Industrial Goods Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Industrial Goods" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Services Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Services" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Technology Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Technology" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }))

        //        .AddItem(new ElementItem() { Name = "Utilities Sector" }
        //            .AddCell(new ElementCell() { ElementField = sectorNameField, StringValue = "Utilities" }
        //                .AddUserCell(new UserElementCell() { User = user, Rating = 11 }))
        //            .AddCell(new ElementCell() { ElementField = sectorSalesPriceField, DecimalValue = 100 })
        //            .AddCell(new ElementCell() { ElementField = sectorSalesNumberField, DecimalValue = 0 }));

        //    // User resource pool, index
        //    sectorResourcePool
        //        .AddUserResourcePool(new UserResourcePool() { User = user, ResourcePoolRate = 101 }
        //            .AddIndex(new UserResourcePoolIndex() { Rating = 100 }));

        //    // Insert
        //    resourcePoolRepository.Insert(sectorResourcePool);
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
