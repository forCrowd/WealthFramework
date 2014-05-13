namespace DataObjects.Migrations
{
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "DataObjects.WealthEconomyContext";

            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(WealthEconomyContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            foreach (var migration in pendingMigrations)
            {
                switch (migration)
                {
                    case "201405080802306_V0_10_8":
                        {
                            // For an unknown reason, context variable doesn't work with RoleManager and UserManager
                            var dbContext = new WealthEconomyContext();

                            // Admin
                            var roleStore = new RoleStore<IdentityRole>(dbContext);
                            var roleManager = new RoleManager<IdentityRole>(roleStore);
                            var adminRole = new IdentityRole("Administrator");
                            var adminRoleResult = roleManager.Create(adminRole);

                            // TODO result error check?
                            if (adminRoleResult == null)
                                return;

                            var userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(dbContext));
                            var adminUser = new IdentityUser("admin");
                            var adminPassword = DateTime.Now.ToString("yyyyMMdd");
                            
                            // TODO Make this better?
                            var adminUserResult = userManager.Create(adminUser, adminPassword);

                            // TODO result error check?
                            if (adminUserResult == null)
                                return;

                            var addToRoleResult = userManager.AddToRole(adminUser.Id, "Administrator");

                            // TODO result error check?

                            var user = new BusinessObjects.User() { AspNetUserId = adminUser.Id, Email = adminUser.UserName };
                            var userRepository = new UserRepository(dbContext);
                            userRepository.Insert(user);
                            // userRepository.SaveChanges();
                            
                            // Initial records
                            var resourcePoolRepository = new ResourcePoolRepository(dbContext);
                            var sectorRepository = new SectorRepository(dbContext);
                            var licenseRepository = new LicenseRepository(dbContext);
                            var organizationRepository = new OrganizationRepository(dbContext);
                            var userResourcePoolRepository = new UserResourcePoolRepository(dbContext);
                            var userSectorRatingRepository = new UserSectorRatingRepository(dbContext);
                            var userLicenseRatingRepository = new UserLicenseRatingRepository(dbContext);
                            var userOrganizationRepository = new UserOrganizationRepository(dbContext);

                            // Total Cost
                            var totalCostResourcePool = new BusinessObjects.ResourcePool() { Name = "Total Cost Index Sample" };
                            var totalCostSector = new BusinessObjects.Sector() { ResourcePool = totalCostResourcePool, Name = "Generic Sector" };
                            var totalCostLicense = new BusinessObjects.License() { ResourcePool = totalCostResourcePool, Name = "Generic License", Text = "License Text" };
                            var totalCostOrganization1 = new BusinessObjects.Organization() { Sector = totalCostSector, Name = "1x", ProductionCost = 100, SalesPrice = 100, License = totalCostLicense };
                            var totalCostOrganization2 = new BusinessObjects.Organization() { Sector = totalCostSector, Name = "4x", ProductionCost = 100, SalesPrice = 500, License = totalCostLicense };
                            var totalCostUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = totalCostResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 100, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 0 };
                            var totalCostUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var totalCostUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(totalCostResourcePool);
                            sectorRepository.Insert(totalCostSector);
                            licenseRepository.Insert(totalCostLicense);
                            organizationRepository.Insert(totalCostOrganization1);
                            organizationRepository.Insert(totalCostOrganization2);
                            userResourcePoolRepository.Insert(totalCostUserResourcePool);
                            userOrganizationRepository.Insert(totalCostUserOrganization1);
                            userOrganizationRepository.Insert(totalCostUserOrganization2);

                            // Knowledge Index
                            var knowledgeResourcePool = new BusinessObjects.ResourcePool() { Name = "Knowledge Index Sample" };
                            var knowledgeSector = new BusinessObjects.Sector() { ResourcePool = knowledgeResourcePool, Name = "Generic Sector" };
                            var knowledgeLicense1 = new BusinessObjects.License() { ResourcePool = knowledgeResourcePool, Name = "Open License", Description = "Open source license sample", Text = "When you use this license it allows everyone to use your license without any restriction" };
                            var knowledgeLicense2 = new BusinessObjects.License() { ResourcePool = knowledgeResourcePool, Name = "Restricted License", Description = "Restricted license sample", Text = "Can't, can't, can't" };
                            var knowledgeOrganization1 = new BusinessObjects.Organization() { Sector = knowledgeSector, Name = "True Source", ProductionCost = 100, SalesPrice = 200, License = knowledgeLicense1 };
                            var knowledgeOrganization2 = new BusinessObjects.Organization() { Sector = knowledgeSector, Name = "Hidden Knowledge", ProductionCost = 100, SalesPrice = 200, License = knowledgeLicense2 };
                            var knowledgeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = knowledgeResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 100, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 0 };
                            var knowledgeUserLicenseRating1 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense1, Rating = 80 };
                            var knowledgeUserLicenseRating2 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense2, Rating = 20 };
                            var knowledgeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var knowledgeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(knowledgeResourcePool);
                            sectorRepository.Insert(knowledgeSector);
                            licenseRepository.Insert(knowledgeLicense1);
                            licenseRepository.Insert(knowledgeLicense2);
                            organizationRepository.Insert(knowledgeOrganization1);
                            organizationRepository.Insert(knowledgeOrganization2);
                            userResourcePoolRepository.Insert(knowledgeUserResourcePool);
                            userLicenseRatingRepository.Insert(knowledgeUserLicenseRating1);
                            userLicenseRatingRepository.Insert(knowledgeUserLicenseRating2);
                            userOrganizationRepository.Insert(knowledgeUserOrganization1);
                            userOrganizationRepository.Insert(knowledgeUserOrganization2);

                            // Quality
                            var qualityResourcePool = new BusinessObjects.ResourcePool() { Name = "Quality Index Sample" };
                            var qualitySector = new BusinessObjects.Sector() { ResourcePool = qualityResourcePool, Name = "Generic Sector" };
                            var qualityLicense = new BusinessObjects.License() { ResourcePool = qualityResourcePool, Name = "Generic License", Text = "License Text" };
                            var qualityOrganization1 = new BusinessObjects.Organization() { Sector = qualitySector, Name = "Wealth's Finest", ProductionCost = 100, SalesPrice = 200, License = qualityLicense };
                            var qualityOrganization2 = new BusinessObjects.Organization() { Sector = qualitySector, Name = "Poor Beggar", ProductionCost = 100, SalesPrice = 200, License = qualityLicense };
                            var qualityUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = qualityResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 100, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 0 };
                            var qualityUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0, QualityRating = 80, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var qualityUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0, QualityRating = 20, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(qualityResourcePool);
                            sectorRepository.Insert(qualitySector);
                            licenseRepository.Insert(qualityLicense);
                            organizationRepository.Insert(qualityOrganization1);
                            organizationRepository.Insert(qualityOrganization2);
                            userResourcePoolRepository.Insert(qualityUserResourcePool);
                            userOrganizationRepository.Insert(qualityUserOrganization1);
                            userOrganizationRepository.Insert(qualityUserOrganization2);

                            // Employee
                            var employeeResourcePool = new BusinessObjects.ResourcePool() { Name = "Employee Satisfaction Index Sample" };
                            var employeeSector = new BusinessObjects.Sector() { ResourcePool = employeeResourcePool, Name = "Generic Sector" };
                            var employeeLicense = new BusinessObjects.License() { ResourcePool = employeeResourcePool, Name = "Generic License", Text = "License Text" };
                            var employeeOrganization1 = new BusinessObjects.Organization() { Sector = employeeSector, Name = "One Big Family", ProductionCost = 100, SalesPrice = 200, License = employeeLicense };
                            var employeeOrganization2 = new BusinessObjects.Organization() { Sector = employeeSector, Name = "Reckless Ones", ProductionCost = 100, SalesPrice = 200, License = employeeLicense };
                            var employeeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = employeeResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 100, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 0 };
                            var employeeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 80 };
                            var employeeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 20 };

                            resourcePoolRepository.Insert(employeeResourcePool);
                            sectorRepository.Insert(employeeSector);
                            licenseRepository.Insert(employeeLicense);
                            organizationRepository.Insert(employeeOrganization1);
                            organizationRepository.Insert(employeeOrganization2);
                            userResourcePoolRepository.Insert(employeeUserResourcePool);
                            userOrganizationRepository.Insert(employeeUserOrganization1);
                            userOrganizationRepository.Insert(employeeUserOrganization2);

                            // Customer
                            var customerResourcePool = new BusinessObjects.ResourcePool() { Name = "Customer Satisfaction Index Sample" };
                            var customerSector = new BusinessObjects.Sector() { ResourcePool = customerResourcePool, Name = "Generic Sector" };
                            var customerLicense = new BusinessObjects.License() { ResourcePool = customerResourcePool, Name = "Generic License", Text = "License Text" };
                            var customerOrganization1 = new BusinessObjects.Organization() { Sector = customerSector, Name = "Friendly Faieries", ProductionCost = 100, SalesPrice = 200, License = customerLicense };
                            var customerOrganization2 = new BusinessObjects.Organization() { Sector = customerSector, Name = "Clumsy Clowns", ProductionCost = 100, SalesPrice = 200, License = customerLicense };
                            var customerUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = customerResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 100, DistanceIndexRating = 0 };
                            var customerUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 80, EmployeeSatisfactionRating = 0 };
                            var customerUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 20, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(customerResourcePool);
                            sectorRepository.Insert(customerSector);
                            licenseRepository.Insert(customerLicense);
                            organizationRepository.Insert(customerOrganization1);
                            organizationRepository.Insert(customerOrganization2);
                            userResourcePoolRepository.Insert(customerUserResourcePool);
                            userOrganizationRepository.Insert(customerUserOrganization1);
                            userOrganizationRepository.Insert(customerUserOrganization2);

                            // Sector
                            var sectorResourcePool = new BusinessObjects.ResourcePool() { Name = "Sector Index Sample" };
                            var sectorSector1 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Utilities" };
                            var sectorSector2 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Consumer Goods" };
                            var sectorSector3 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Basic Materials" };
                            var sectorSector4 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Services" };
                            var sectorSector5 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Technology" };
                            var sectorSector6 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Industrial Goods" };
                            var sectorSector7 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Conglomerates" };
                            var sectorSector8 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Financial" };
                            var sectorLicense = new BusinessObjects.License() { ResourcePool = sectorResourcePool, Name = "Generic License", Text = "License Text" };
                            var sectorOrganization1 = new BusinessObjects.Organization() { Sector = sectorSector1, Name = "Utilities", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization2 = new BusinessObjects.Organization() { Sector = sectorSector2, Name = "Consumer Goods", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization3 = new BusinessObjects.Organization() { Sector = sectorSector3, Name = "Basic Materials", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization4 = new BusinessObjects.Organization() { Sector = sectorSector4, Name = "Services", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization5 = new BusinessObjects.Organization() { Sector = sectorSector5, Name = "Technology", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization6 = new BusinessObjects.Organization() { Sector = sectorSector6, Name = "Industrial Goods", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization7 = new BusinessObjects.Organization() { Sector = sectorSector7, Name = "Conglomerates", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorOrganization8 = new BusinessObjects.Organization() { Sector = sectorSector8, Name = "Financial", ProductionCost = 100, SalesPrice = 200, License = sectorLicense };
                            var sectorUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = sectorResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 100, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 0 };
                            var sectorUserSectorRating1 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector1, Rating = 12.5m };
                            var sectorUserSectorRating2 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector2, Rating = 12.5m };
                            var sectorUserSectorRating3 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector3, Rating = 12.5m };
                            var sectorUserSectorRating4 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector4, Rating = 12.5m };
                            var sectorUserSectorRating5 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector5, Rating = 12.5m };
                            var sectorUserSectorRating6 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector6, Rating = 12.5m };
                            var sectorUserSectorRating7 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector7, Rating = 12.5m };
                            var sectorUserSectorRating8 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector8, Rating = 12.5m };
                            var sectorUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization3 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization4 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization5 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization6 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization7 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var sectorUserOrganization8 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(sectorResourcePool);
                            sectorRepository.Insert(sectorSector1);
                            sectorRepository.Insert(sectorSector2);
                            sectorRepository.Insert(sectorSector3);
                            sectorRepository.Insert(sectorSector4);
                            sectorRepository.Insert(sectorSector5);
                            sectorRepository.Insert(sectorSector6);
                            sectorRepository.Insert(sectorSector7);
                            sectorRepository.Insert(sectorSector8);
                            licenseRepository.Insert(sectorLicense);
                            organizationRepository.Insert(sectorOrganization1);
                            organizationRepository.Insert(sectorOrganization2);
                            organizationRepository.Insert(sectorOrganization3);
                            organizationRepository.Insert(sectorOrganization4);
                            organizationRepository.Insert(sectorOrganization5);
                            organizationRepository.Insert(sectorOrganization6);
                            organizationRepository.Insert(sectorOrganization7);
                            organizationRepository.Insert(sectorOrganization8);
                            userResourcePoolRepository.Insert(sectorUserResourcePool);
                            userSectorRatingRepository.Insert(sectorUserSectorRating1);
                            userSectorRatingRepository.Insert(sectorUserSectorRating2);
                            userSectorRatingRepository.Insert(sectorUserSectorRating3);
                            userSectorRatingRepository.Insert(sectorUserSectorRating4);
                            userSectorRatingRepository.Insert(sectorUserSectorRating5);
                            userSectorRatingRepository.Insert(sectorUserSectorRating6);
                            userSectorRatingRepository.Insert(sectorUserSectorRating7);
                            userSectorRatingRepository.Insert(sectorUserSectorRating8);
                            userOrganizationRepository.Insert(sectorUserOrganization1);
                            userOrganizationRepository.Insert(sectorUserOrganization2);
                            userOrganizationRepository.Insert(sectorUserOrganization3);
                            userOrganizationRepository.Insert(sectorUserOrganization4);
                            userOrganizationRepository.Insert(sectorUserOrganization5);
                            userOrganizationRepository.Insert(sectorUserOrganization6);
                            userOrganizationRepository.Insert(sectorUserOrganization7);
                            userOrganizationRepository.Insert(sectorUserOrganization8);

                            // Distance
                            var distanceResourcePool = new BusinessObjects.ResourcePool() { Name = "Distance Index Sample" };
                            var distanceSector = new BusinessObjects.Sector() { ResourcePool = distanceResourcePool, Name = "Generic Sector" };
                            var distanceLicense = new BusinessObjects.License() { ResourcePool = distanceResourcePool, Name = "Generic License", Text = "License Text" };
                            var distanceOrganization1 = new BusinessObjects.Organization() { Sector = distanceSector, Name = "Home", ProductionCost = 100, SalesPrice = 200, License = distanceLicense };
                            var distanceOrganization2 = new BusinessObjects.Organization() { Sector = distanceSector, Name = "Far Far Away Galaxy", ProductionCost = 100, SalesPrice = 200, License = distanceLicense };
                            var distanceUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = distanceResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0, DistanceIndexRating = 100 };
                            var distanceUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
                            var distanceUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

                            resourcePoolRepository.Insert(distanceResourcePool);
                            sectorRepository.Insert(distanceSector);
                            licenseRepository.Insert(distanceLicense);
                            organizationRepository.Insert(distanceOrganization1);
                            organizationRepository.Insert(distanceOrganization2);
                            userResourcePoolRepository.Insert(distanceUserResourcePool);
                            userOrganizationRepository.Insert(distanceUserOrganization1);
                            userOrganizationRepository.Insert(distanceUserOrganization2);

                            dbContext.SaveChanges();

                            // All in One
                            // TODO

                            // TODO Handle this Seed operation by raising an event and catching it in Facade layer, so UnitOfWork classes could be used?

                            break;
                        }
                }            
            }
        }
    }
}
