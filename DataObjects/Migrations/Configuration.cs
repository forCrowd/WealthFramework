namespace DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using System.Threading.Tasks;

    internal sealed class Configuration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

        public Configuration()
        {
            ContextKey = "WealthEconomyContext";
            AutomaticMigrationsEnabled = false;

            // Get the migrations
            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(WealthEconomyContext context)
        {
            foreach (var migration in pendingMigrations)
            {
                // Get the version number
                var migrationVersion = migration.Substring(migration.IndexOf("_") + 1);

                switch (migrationVersion)
                {
                    case "V0_14_7":
                        {
                            var roleStore = new RoleStore(context);
                            var roleManager = new RoleManager<Role, int>(roleStore);
                            var userStore = new UserStore(context);
                            var userManager = new UserManager<User, int>(userStore);

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
                            //AddSectorIndexSample(sampleUser);
                            //AddKnowledgeIndexSample(sampleUser);
                            //AddTotalCostIndexSample(sampleUser);

                            // TODO Update these with dynamic indexes!
                            //AddQualityIndexSample(sampleUser);
                            //AddEmployeeSatisfactionIndexSample(sampleUser);
                            //AddCustomerSatisfactionIndexSample(sampleUser);
                            //AddAllInOneSample(sampleUser);

                            //Context.SaveChanges();

                            break;
                        }
                }
            }
        }

        //void AddSectorIndexSample(BusinessObjects.User user)
        //{
        //    // TODO Update this with DynamicFieldIndex type

        //    var sectorResourcePool = new BusinessObjects.ResourcePool() { Name = "Sector Index Sample", IsSample = true };
        //    var sectorResourcePoolIndex = new BusinessObjects.ResourcePoolIndex() { ResourcePool = sectorResourcePool, Name = "Sector Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, RatingSortType = (byte)RatingSortType.HighestToLowest };
        //    var sectorOrganization1 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Basic Materials", SalesPrice = 150 };
        //    var sectorOrganization2 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Conglomerates", SalesPrice = 150 };
        //    var sectorOrganization3 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Consumer Goods", SalesPrice = 150 };
        //    var sectorOrganization4 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Financial", SalesPrice = 150 };
        //    var sectorOrganization5 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Healthcare", SalesPrice = 150 };
        //    var sectorOrganization6 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Industrial Goods", SalesPrice = 150 };
        //    var sectorOrganization7 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Services", SalesPrice = 150 };
        //    var sectorOrganization8 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Technology", SalesPrice = 150 };
        //    var sectorOrganization9 = new BusinessObjects.Organization() { ResourcePool = sectorResourcePool, Name = "Utilities", SalesPrice = 150 };
        //    var sectorUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = sectorResourcePool, ResourcePoolRate = 101 };
        //    var sectorUserResourcePoolIndex = new BusinessObjects.UserResourcePoolIndex() { UserResourcePool = sectorUserResourcePool, ResourcePoolIndex = sectorResourcePoolIndex, Rating = 100 };
        //    var sectorUserResourcePoolIndexValue1 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization1, Rating = 12 };
        //    var sectorUserResourcePoolIndexValue2 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization2, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue3 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization3, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue4 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization4, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue5 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization5, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue6 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization6, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue7 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization7, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue8 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization8, Rating = 11 };
        //    var sectorUserResourcePoolIndexValue9 = new BusinessObjects.UserResourcePoolIndexValue() { UserResourcePoolIndex = sectorUserResourcePoolIndex, Organization = sectorOrganization9, Rating = 11 };
        //    var sectorUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0 };
        //    var sectorUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0 };
        //    var sectorUserOrganization3 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0 };
        //    var sectorUserOrganization4 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0 };
        //    var sectorUserOrganization5 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0 };
        //    var sectorUserOrganization6 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0 };
        //    var sectorUserOrganization7 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0 };
        //    var sectorUserOrganization8 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0 };
        //    var sectorUserOrganization9 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(sectorResourcePool);
        //    ResourcePoolIndexRepository.Insert(sectorResourcePoolIndex);
        //    OrganizationRepository.Insert(sectorOrganization1);
        //    OrganizationRepository.Insert(sectorOrganization2);
        //    OrganizationRepository.Insert(sectorOrganization3);
        //    OrganizationRepository.Insert(sectorOrganization4);
        //    OrganizationRepository.Insert(sectorOrganization5);
        //    OrganizationRepository.Insert(sectorOrganization6);
        //    OrganizationRepository.Insert(sectorOrganization7);
        //    OrganizationRepository.Insert(sectorOrganization8);
        //    OrganizationRepository.Insert(sectorOrganization9);
        //    UserResourcePoolRepository.Insert(sectorUserResourcePool);
        //    UserResourcePoolIndexRepository.Insert(sectorUserResourcePoolIndex);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue1);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue2);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue3);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue4);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue5);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue6);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue7);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue8);
        //    UserResourcePoolIndexValueRepository.Insert(sectorUserResourcePoolIndexValue9);
        //    UserOrganizationRepository.Insert(sectorUserOrganization1);
        //    UserOrganizationRepository.Insert(sectorUserOrganization2);
        //    UserOrganizationRepository.Insert(sectorUserOrganization3);
        //    UserOrganizationRepository.Insert(sectorUserOrganization4);
        //    UserOrganizationRepository.Insert(sectorUserOrganization5);
        //    UserOrganizationRepository.Insert(sectorUserOrganization6);
        //    UserOrganizationRepository.Insert(sectorUserOrganization7);
        //    UserOrganizationRepository.Insert(sectorUserOrganization8);
        //    UserOrganizationRepository.Insert(sectorUserOrganization9);
        //}

        //void AddKnowledgeIndexSample(BusinessObjects.User user)
        //{
        //    // Update this with DynamicFieldIndex type

        //    var knowledgeResourcePool = new BusinessObjects.ResourcePool() { Name = "Knowledge Index Sample", IsSample = true };
        //    var knowledgeLicenseElement = new Element() { ResourcePool = knowledgeResourcePool, Name = "License" };
        //    var knowledgeLicenseItem1 = new ElementItem() { Element = knowledgeLicenseElement, Name = "Open License" };
        //    var knowledgeLicenseItem2 = new ElementItem() { Element = knowledgeLicenseElement, Name = "Restricted License" };
        //    var knowledgeResourcePoolIndex = new BusinessObjects.ResourcePoolIndex() { ResourcePool = knowledgeResourcePool, Name = "Knowledge Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, Element = knowledgeLicenseElement, RatingSortType = (byte)RatingSortType.LowestToHighest };
        //    var knowledgeOrganization1 = new BusinessObjects.Organization() { ResourcePool = knowledgeResourcePool, Name = "True Source", SalesPrice = 150 };
        //    var knowledgeOrganizationLicenseItem1 = new BusinessObjects.OrganizationElementItem() { Organization = knowledgeOrganization1, ElementItem = knowledgeLicenseItem1 };
        //    var knowledgeOrganization2 = new BusinessObjects.Organization() { ResourcePool = knowledgeResourcePool, Name = "Hidden Knowledge", SalesPrice = 150 };
        //    var knowledgeOrganizationLicenseItem2 = new BusinessObjects.OrganizationElementItem() { Organization = knowledgeOrganization2, ElementItem = knowledgeLicenseItem2 };
        //    var knowledgeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = knowledgeResourcePool, ResourcePoolRate = 101 };
        //    var knowledgeUserResourcePoolIndex = new BusinessObjects.UserResourcePoolIndex() { UserResourcePool = knowledgeUserResourcePool, ResourcePoolIndex = knowledgeResourcePoolIndex, Rating = 100 };
        //    var knowledgeUserLicenseItemRating1 = new BusinessObjects.UserElementItem() { User = user, ElementItem = knowledgeLicenseItem1, Rating = 75 };
        //    var knowledgeUserLicenseItemRating2 = new BusinessObjects.UserElementItem() { User = user, ElementItem = knowledgeLicenseItem2, Rating = 25 };
        //    var knowledgeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0 };
        //    var knowledgeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0 };

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

        //void AddTotalCostIndexSample(BusinessObjects.User user)
        //{
        //    // TODO Update this with Dynamic Field Index
        //    var totalCostResourcePool = new BusinessObjects.ResourcePool() { Name = "Total Cost Index Sample", IsSample = true };
        //    var totalCostResourcePoolIndex = new BusinessObjects.ResourcePoolIndex() { ResourcePool = totalCostResourcePool, Name = "Total Cost Index", ResourcePoolIndexType = (byte)ResourcePoolIndexType.DynamicElementFieldIndex, RatingSortType = (byte)RatingSortType.LowestToHighest };
        //    var totalCostOrganization1 = new BusinessObjects.Organization() { ResourcePool = totalCostResourcePool, Name = "Lowlands", SalesPrice = 125 };
        //    var totalCostOrganization2 = new BusinessObjects.Organization() { ResourcePool = totalCostResourcePool, Name = "High Coast", SalesPrice = 175 };
        //    var totalCostUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = totalCostResourcePool, ResourcePoolRate = 101 };
        //    var totalCostUserResourcePoolIndex = new BusinessObjects.UserResourcePoolIndex() { UserResourcePool = totalCostUserResourcePool, ResourcePoolIndex = totalCostResourcePoolIndex, Rating = 100 };
        //    var totalCostUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization1, NumberOfSales = 0 };
        //    var totalCostUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization2, NumberOfSales = 0 };

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
        //void AddQualityIndexSample(BusinessObjects.User user)
        //{
        //    var qualityResourcePool = new BusinessObjects.ResourcePool() { Name = "Quality Index Sample", IsSample = true };
        //    var qualityOrganization1 = new BusinessObjects.Organization() { ResourcePool = qualityResourcePool, Name = "Wealth's Finest", SalesPrice = 150 };
        //    var qualityOrganization2 = new BusinessObjects.Organization() { ResourcePool = qualityResourcePool, Name = "Poor Beggar", SalesPrice = 150 };
        //    var qualityUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = qualityResourcePool, ResourcePoolRate = 101 };
        //    var qualityUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0 };
        //    var qualityUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(qualityResourcePool);
        //    OrganizationRepository.Insert(qualityOrganization1);
        //    OrganizationRepository.Insert(qualityOrganization2);
        //    UserResourcePoolRepository.Insert(qualityUserResourcePool);
        //    UserOrganizationRepository.Insert(qualityUserOrganization1);
        //    UserOrganizationRepository.Insert(qualityUserOrganization2);
        //}

        //void AddEmployeeSatisfactionIndexSample(BusinessObjects.User user)
        //{
        //    var employeeResourcePool = new BusinessObjects.ResourcePool() { Name = "Employee Satisfaction Index Sample", IsSample = true };
        //    var employeeOrganization1 = new BusinessObjects.Organization() { ResourcePool = employeeResourcePool, Name = "One Big Family", SalesPrice = 150 };
        //    var employeeOrganization2 = new BusinessObjects.Organization() { ResourcePool = employeeResourcePool, Name = "Reckless Ones", SalesPrice = 150 };
        //    var employeeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = employeeResourcePool, ResourcePoolRate = 101 };
        //    var employeeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0 };
        //    var employeeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(employeeResourcePool);
        //    OrganizationRepository.Insert(employeeOrganization1);
        //    OrganizationRepository.Insert(employeeOrganization2);
        //    UserResourcePoolRepository.Insert(employeeUserResourcePool);
        //    UserOrganizationRepository.Insert(employeeUserOrganization1);
        //    UserOrganizationRepository.Insert(employeeUserOrganization2);
        //}

        //void AddCustomerSatisfactionIndexSample(BusinessObjects.User user)
        //{
        //    var customerResourcePool = new BusinessObjects.ResourcePool() { Name = "Customer Satisfaction Index Sample", IsSample = true };
        //    var customerOrganization1 = new BusinessObjects.Organization() { ResourcePool = customerResourcePool, Name = "Friendly Faieries", SalesPrice = 150 };
        //    var customerOrganization2 = new BusinessObjects.Organization() { ResourcePool = customerResourcePool, Name = "Clumsy Clowns", SalesPrice = 150 };
        //    var customerUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = customerResourcePool, ResourcePoolRate = 101 };
        //    var customerUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0 };
        //    var customerUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0 };

        //    ResourcePoolRepository.Insert(customerResourcePool);
        //    OrganizationRepository.Insert(customerOrganization1);
        //    OrganizationRepository.Insert(customerOrganization2);
        //    UserResourcePoolRepository.Insert(customerUserResourcePool);
        //    UserOrganizationRepository.Insert(customerUserOrganization1);
        //    UserOrganizationRepository.Insert(customerUserOrganization2);
        //}

        //void AddAllInOneSample(BusinessObjects.User user)
        //{
        //    // TODO Add dynamic indexes and update index ratings

        //    var allInOneResourcePool = new BusinessObjects.ResourcePool() { Name = "All in One Sample", IsSample = true };
        //    var allInOneUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = allInOneResourcePool, ResourcePoolRate = 101 };

        //    // Total Cost
        //    var allInOneTotalCostOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Lowlands", SalesPrice = 125 };
        //    var allInOneTotalCostOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "High Coast", SalesPrice = 175 };
        //    var allInOneUserTotalCostOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = allInOneTotalCostOrganization1, NumberOfSales = 0 };
        //    var allInOneUserTotalCostOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = allInOneTotalCostOrganization2, NumberOfSales = 0 };

        //    // Knowledge
        //    // TODO
        //    var knowledgeOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "True Source", SalesPrice = 150 };
        //    var knowledgeOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Hidden Knowledge", SalesPrice = 150 };
        //    var knowledgeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0 };
        //    var knowledgeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0 };


        //    // Quality
        //    var qualityOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Wealth's Finest", SalesPrice = 150 };
        //    var qualityOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Poor Beggar", SalesPrice = 150 };
        //    var qualityUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0 };
        //    var qualityUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0 };

        //    // Employee
        //    var employeeOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "One Big Family", SalesPrice = 150 };
        //    var employeeOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Reckless Ones", SalesPrice = 150 };
        //    var employeeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0 };
        //    var employeeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0 };

        //    // Customer
        //    var customerOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Friendly Faieries", SalesPrice = 150 };
        //    var customerOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Clumsy Clowns", SalesPrice = 150 };
        //    var customerUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0 };
        //    var customerUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0 };

        //    // Sector
        //    var sectorOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Basic Materials", SalesPrice = 150 };
        //    var sectorOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Conglomerates", SalesPrice = 150 };
        //    var sectorOrganization3 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Consumer Goods", SalesPrice = 150 };
        //    var sectorOrganization4 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Financial", SalesPrice = 150 };
        //    var sectorOrganization5 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Healthcare", SalesPrice = 150 };
        //    var sectorOrganization6 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Industrial Goods", SalesPrice = 150 };
        //    var sectorOrganization7 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Services", SalesPrice = 150 };
        //    var sectorOrganization8 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Technology", SalesPrice = 150 };
        //    var sectorOrganization9 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Utilities", SalesPrice = 150 };
        //    // TODO Sector Index ratings
        //    //var sectorUserSectorRating1 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector1, Rating = 12 };
        //    //var sectorUserSectorRating2 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector2, Rating = 11 };
        //    //var sectorUserSectorRating3 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector3, Rating = 11 };
        //    //var sectorUserSectorRating4 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector4, Rating = 11 };
        //    //var sectorUserSectorRating5 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector5, Rating = 11 };
        //    //var sectorUserSectorRating6 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector6, Rating = 11 };
        //    //var sectorUserSectorRating7 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector7, Rating = 11 };
        //    //var sectorUserSectorRating8 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector8, Rating = 11 };
        //    //var sectorUserSectorRating9 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector9, Rating = 11 };
        //    var sectorUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0 };
        //    var sectorUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0 };
        //    var sectorUserOrganization3 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0 };
        //    var sectorUserOrganization4 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0 };
        //    var sectorUserOrganization5 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0 };
        //    var sectorUserOrganization6 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0 };
        //    var sectorUserOrganization7 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0 };
        //    var sectorUserOrganization8 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0 };
        //    var sectorUserOrganization9 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0 };

        //    // Distance
        //    var distanceOrganization1 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Home", SalesPrice = 150 };
        //    var distanceOrganization2 = new BusinessObjects.Organization() { ResourcePool = allInOneResourcePool, Name = "Far Far Away Galaxy", SalesPrice = 150 };
        //    var distanceUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization1, NumberOfSales = 0 };
        //    var distanceUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization2, NumberOfSales = 0 };

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
