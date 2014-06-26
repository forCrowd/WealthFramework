namespace DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

        ResourcePoolRepository resourcePoolRepository;
        SectorRepository sectorRepository;
        LicenseRepository licenseRepository;
        OrganizationRepository organizationRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserSectorRatingRepository userSectorRatingRepository;
        UserLicenseRatingRepository userLicenseRatingRepository;
        UserOrganizationRepository userOrganizationRepository;

        // For an unknown reason, context variable doesn't work with RoleManager and UserManager
        public WealthEconomyContext Context { get; private set; }

        public ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        public SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        public LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }
        public OrganizationRepository OrganizationRepository
        {
            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        UserSectorRatingRepository UserSectorRatingRepository
        {
            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(Context)); }
        }

        UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
        }

        UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "DataObjects.WealthEconomyContext";

            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();

            Context = new WealthEconomyContext();
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
                    case "201405211032455_V0_11_10":
                        {
                            // Set first 8 resource pool records as sample (for existing databases)
                            const int maxSampleResourcePoolId = 8;
                            var list = ResourcePoolRepository.All.Where(item => item.Id <= maxSampleResourcePoolId).AsEnumerable();
                            foreach (var item in list)
                                item.IsSample = true;
                            Context.SaveChanges();
                            break;
                        }
                    case "201405080802306_V0_10_8":
                        {
                            // Admin
                            var roleStore = new RoleStore<IdentityRole>(Context);
                            var roleManager = new RoleManager<IdentityRole>(roleStore);
                            var adminRole = new IdentityRole("Administrator");
                            var adminRoleResult = roleManager.Create(adminRole);

                            // TODO result error check?
                            if (adminRoleResult == null)
                                return;

                            var userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(Context));
                            var adminIdentityUser = new IdentityUser("admin");
                            var adminIdentityUserPassword = DateTime.Now.ToString("yyyyMMdd");
                            
                            // TODO Make this better?
                            var adminIdentityUserResult = userManager.Create(adminIdentityUser, adminIdentityUserPassword);

                            // TODO result error check?
                            if (adminIdentityUserResult == null)
                                return;

                            var addAdminIdentityUserToRoleResult = userManager.AddToRole(adminIdentityUser.Id, "Administrator");

                            // TODO result error check?
                            if (addAdminIdentityUserToRoleResult == null)
                                return;

                            var adminUser = new BusinessObjects.User() { AspNetUserId = adminIdentityUser.Id, Email = adminIdentityUser.UserName };
                            var userRepository = new UserRepository(Context);
                            userRepository.Insert(adminUser);

                            // Sample user
                            var sampleIdentityUser = new IdentityUser("sample");
                            var sampleIdentityUserPassword = DateTime.Now.ToString("yyyyMMdd");

                            // TODO Make this better?
                            var sampleIdentityUserResult = userManager.Create(sampleIdentityUser, sampleIdentityUserPassword);

                            // TODO result error check?
                            if (sampleIdentityUserResult == null)
                                return;

                            var sampleUser = new BusinessObjects.User() { AspNetUserId = sampleIdentityUser.Id, Email = sampleIdentityUser.UserName };
                            userRepository.Insert(sampleUser);

                            // Samples
                            AddSectorIndexSample(sampleUser);
                            AddKnowledgeIndexSample(sampleUser);
                            AddTotalCostIndexSample(sampleUser);
                            AddQualityIndexSample(sampleUser);
                            AddEmployeeSatisfactionIndexSample(sampleUser);
                            AddCustomerSatisfactionIndexSample(sampleUser);
                            AddAllInOneSample(sampleUser);

                            Context.SaveChanges();

                            // TODO Handle this Seed operation by raising an event and catching it in Facade layer, so UnitOfWork classes could be used?

                            break;
                        }
                }            
            }
        }

        void AddSectorIndexSample(BusinessObjects.User user)
        {
            var sectorResourcePool = new BusinessObjects.ResourcePool() { Name = "Sector Index Sample", IsSample = true };
            var sectorSector1 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Basic Materials" };
            var sectorSector2 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Conglomerates" };
            var sectorSector3 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Consumer Goods" };
            var sectorSector4 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Financial" };
            var sectorSector5 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Healthcare" };
            var sectorSector6 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Industrial Goods" };
            var sectorSector7 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Services" };
            var sectorSector8 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Technology" };
            var sectorSector9 = new BusinessObjects.Sector() { ResourcePool = sectorResourcePool, Name = "Utilities" };
            var sectorLicense = new BusinessObjects.License() { ResourcePool = sectorResourcePool, Name = "Sector Index Generic License", Text = "License Text" };
            var sectorOrganization1 = new BusinessObjects.Organization() { Sector = sectorSector1, Name = "Basic Materials", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization2 = new BusinessObjects.Organization() { Sector = sectorSector2, Name = "Conglomerates", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization3 = new BusinessObjects.Organization() { Sector = sectorSector3, Name = "Consumer Goods", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization4 = new BusinessObjects.Organization() { Sector = sectorSector4, Name = "Financial", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization5 = new BusinessObjects.Organization() { Sector = sectorSector5, Name = "Healthcare", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization6 = new BusinessObjects.Organization() { Sector = sectorSector6, Name = "Industrial Goods", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization7 = new BusinessObjects.Organization() { Sector = sectorSector7, Name = "Services", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization8 = new BusinessObjects.Organization() { Sector = sectorSector8, Name = "Technology", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorOrganization9 = new BusinessObjects.Organization() { Sector = sectorSector9, Name = "Utilities", ProductionCost = 100, SalesPrice = 150, License = sectorLicense };
            var sectorUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = sectorResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 100, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0 };
            var sectorUserSectorRating1 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector1, Rating = 12 };
            var sectorUserSectorRating2 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector2, Rating = 11 };
            var sectorUserSectorRating3 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector3, Rating = 11 };
            var sectorUserSectorRating4 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector4, Rating = 11 };
            var sectorUserSectorRating5 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector5, Rating = 11 };
            var sectorUserSectorRating6 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector6, Rating = 11 };
            var sectorUserSectorRating7 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector7, Rating = 11 };
            var sectorUserSectorRating8 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector8, Rating = 11 };
            var sectorUserSectorRating9 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector9, Rating = 11 };
            var sectorUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization3 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization4 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization5 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization6 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization7 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization8 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var sectorUserOrganization9 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

            ResourcePoolRepository.Insert(sectorResourcePool);
            SectorRepository.Insert(sectorSector1);
            SectorRepository.Insert(sectorSector2);
            SectorRepository.Insert(sectorSector3);
            SectorRepository.Insert(sectorSector4);
            SectorRepository.Insert(sectorSector5);
            SectorRepository.Insert(sectorSector6);
            SectorRepository.Insert(sectorSector7);
            SectorRepository.Insert(sectorSector8);
            SectorRepository.Insert(sectorSector9);
            LicenseRepository.Insert(sectorLicense);
            OrganizationRepository.Insert(sectorOrganization1);
            OrganizationRepository.Insert(sectorOrganization2);
            OrganizationRepository.Insert(sectorOrganization3);
            OrganizationRepository.Insert(sectorOrganization4);
            OrganizationRepository.Insert(sectorOrganization5);
            OrganizationRepository.Insert(sectorOrganization6);
            OrganizationRepository.Insert(sectorOrganization7);
            OrganizationRepository.Insert(sectorOrganization8);
            OrganizationRepository.Insert(sectorOrganization9);
            UserResourcePoolRepository.Insert(sectorUserResourcePool);
            UserSectorRatingRepository.Insert(sectorUserSectorRating1);
            UserSectorRatingRepository.Insert(sectorUserSectorRating2);
            UserSectorRatingRepository.Insert(sectorUserSectorRating3);
            UserSectorRatingRepository.Insert(sectorUserSectorRating4);
            UserSectorRatingRepository.Insert(sectorUserSectorRating5);
            UserSectorRatingRepository.Insert(sectorUserSectorRating6);
            UserSectorRatingRepository.Insert(sectorUserSectorRating7);
            UserSectorRatingRepository.Insert(sectorUserSectorRating8);
            UserSectorRatingRepository.Insert(sectorUserSectorRating9);
            UserOrganizationRepository.Insert(sectorUserOrganization1);
            UserOrganizationRepository.Insert(sectorUserOrganization2);
            UserOrganizationRepository.Insert(sectorUserOrganization3);
            UserOrganizationRepository.Insert(sectorUserOrganization4);
            UserOrganizationRepository.Insert(sectorUserOrganization5);
            UserOrganizationRepository.Insert(sectorUserOrganization6);
            UserOrganizationRepository.Insert(sectorUserOrganization7);
            UserOrganizationRepository.Insert(sectorUserOrganization8);
            UserOrganizationRepository.Insert(sectorUserOrganization9);
        }

        void AddKnowledgeIndexSample(BusinessObjects.User user)
        {
            var knowledgeResourcePool = new BusinessObjects.ResourcePool() { Name = "Knowledge Index Sample", IsSample = true };
            var knowledgeSector = new BusinessObjects.Sector() { ResourcePool = knowledgeResourcePool, Name = "Knowledge Index Generic Sector" };
            var knowledgeLicense1 = new BusinessObjects.License() { ResourcePool = knowledgeResourcePool, Name = "Open License", Description = "Open source license sample", Text = "When you use this license it allows everyone to use your license without any restriction" };
            var knowledgeLicense2 = new BusinessObjects.License() { ResourcePool = knowledgeResourcePool, Name = "Restricted License", Description = "Restricted license sample", Text = "Can't, can't, can't" };
            var knowledgeOrganization1 = new BusinessObjects.Organization() { Sector = knowledgeSector, Name = "True Source", ProductionCost = 100, SalesPrice = 150, License = knowledgeLicense1 };
            var knowledgeOrganization2 = new BusinessObjects.Organization() { Sector = knowledgeSector, Name = "Hidden Knowledge", ProductionCost = 100, SalesPrice = 150, License = knowledgeLicense2 };
            var knowledgeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = knowledgeResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 100, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0 };
            var knowledgeUserLicenseRating1 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense1, Rating = 75 };
            var knowledgeUserLicenseRating2 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense2, Rating = 25 };
            var knowledgeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var knowledgeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

            ResourcePoolRepository.Insert(knowledgeResourcePool);
            SectorRepository.Insert(knowledgeSector);
            LicenseRepository.Insert(knowledgeLicense1);
            LicenseRepository.Insert(knowledgeLicense2);
            OrganizationRepository.Insert(knowledgeOrganization1);
            OrganizationRepository.Insert(knowledgeOrganization2);
            UserResourcePoolRepository.Insert(knowledgeUserResourcePool);
            UserLicenseRatingRepository.Insert(knowledgeUserLicenseRating1);
            UserLicenseRatingRepository.Insert(knowledgeUserLicenseRating2);
            UserOrganizationRepository.Insert(knowledgeUserOrganization1);
            UserOrganizationRepository.Insert(knowledgeUserOrganization2);
        }

        void AddTotalCostIndexSample(BusinessObjects.User user)
        {
            var totalCostResourcePool = new BusinessObjects.ResourcePool() { Name = "Total Cost Index Sample", IsSample = true };
            var totalCostSector = new BusinessObjects.Sector() { ResourcePool = totalCostResourcePool, Name = "Total Cost Index Generic Sector" };
            var totalCostLicense = new BusinessObjects.License() { ResourcePool = totalCostResourcePool, Name = "Total Cost Index Generic License", Text = "License Text" };
            var totalCostOrganization1 = new BusinessObjects.Organization() { Sector = totalCostSector, Name = "Lowlands", ProductionCost = 100, SalesPrice = 125, License = totalCostLicense };
            var totalCostOrganization2 = new BusinessObjects.Organization() { Sector = totalCostSector, Name = "High Coast", ProductionCost = 100, SalesPrice = 175, License = totalCostLicense };
            var totalCostUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = totalCostResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 100, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0 };
            var totalCostUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var totalCostUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = totalCostOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

            ResourcePoolRepository.Insert(totalCostResourcePool);
            SectorRepository.Insert(totalCostSector);
            LicenseRepository.Insert(totalCostLicense);
            OrganizationRepository.Insert(totalCostOrganization1);
            OrganizationRepository.Insert(totalCostOrganization2);
            UserResourcePoolRepository.Insert(totalCostUserResourcePool);
            UserOrganizationRepository.Insert(totalCostUserOrganization1);
            UserOrganizationRepository.Insert(totalCostUserOrganization2);
        }

        void AddQualityIndexSample(BusinessObjects.User user)
        {
            var qualityResourcePool = new BusinessObjects.ResourcePool() { Name = "Quality Index Sample", IsSample = true };
            var qualitySector = new BusinessObjects.Sector() { ResourcePool = qualityResourcePool, Name = "Quality Index Generic Sector" };
            var qualityLicense = new BusinessObjects.License() { ResourcePool = qualityResourcePool, Name = "Quality Index Generic License", Text = "License Text" };
            var qualityOrganization1 = new BusinessObjects.Organization() { Sector = qualitySector, Name = "Wealth's Finest", ProductionCost = 100, SalesPrice = 150, License = qualityLicense };
            var qualityOrganization2 = new BusinessObjects.Organization() { Sector = qualitySector, Name = "Poor Beggar", ProductionCost = 100, SalesPrice = 150, License = qualityLicense };
            var qualityUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = qualityResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 100, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 0 };
            var qualityUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0, QualityRating = 75, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };
            var qualityUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0, QualityRating = 25, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 0 };

            ResourcePoolRepository.Insert(qualityResourcePool);
            SectorRepository.Insert(qualitySector);
            LicenseRepository.Insert(qualityLicense);
            OrganizationRepository.Insert(qualityOrganization1);
            OrganizationRepository.Insert(qualityOrganization2);
            UserResourcePoolRepository.Insert(qualityUserResourcePool);
            UserOrganizationRepository.Insert(qualityUserOrganization1);
            UserOrganizationRepository.Insert(qualityUserOrganization2);
        }

        void AddEmployeeSatisfactionIndexSample(BusinessObjects.User user)
        {
            var employeeResourcePool = new BusinessObjects.ResourcePool() { Name = "Employee Satisfaction Index Sample", IsSample = true };
            var employeeSector = new BusinessObjects.Sector() { ResourcePool = employeeResourcePool, Name = "Employee Satisfaction Index Generic Sector" };
            var employeeLicense = new BusinessObjects.License() { ResourcePool = employeeResourcePool, Name = "Employee Satisfaction Index Generic License", Text = "License Text" };
            var employeeOrganization1 = new BusinessObjects.Organization() { Sector = employeeSector, Name = "One Big Family", ProductionCost = 100, SalesPrice = 150, License = employeeLicense };
            var employeeOrganization2 = new BusinessObjects.Organization() { Sector = employeeSector, Name = "Reckless Ones", ProductionCost = 100, SalesPrice = 150, License = employeeLicense };
            var employeeUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = employeeResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 100, CustomerSatisfactionIndexRating = 0 };
            var employeeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 75 };
            var employeeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 0, EmployeeSatisfactionRating = 25 };

            ResourcePoolRepository.Insert(employeeResourcePool);
            SectorRepository.Insert(employeeSector);
            LicenseRepository.Insert(employeeLicense);
            OrganizationRepository.Insert(employeeOrganization1);
            OrganizationRepository.Insert(employeeOrganization2);
            UserResourcePoolRepository.Insert(employeeUserResourcePool);
            UserOrganizationRepository.Insert(employeeUserOrganization1);
            UserOrganizationRepository.Insert(employeeUserOrganization2);
        }

        void AddCustomerSatisfactionIndexSample(BusinessObjects.User user)
        {
            var customerResourcePool = new BusinessObjects.ResourcePool() { Name = "Customer Satisfaction Index Sample", IsSample = true };
            var customerSector = new BusinessObjects.Sector() { ResourcePool = customerResourcePool, Name = "Customer Satisfaction Index Generic Sector" };
            var customerLicense = new BusinessObjects.License() { ResourcePool = customerResourcePool, Name = "Customer Satisfaction Index Generic License", Text = "License Text" };
            var customerOrganization1 = new BusinessObjects.Organization() { Sector = customerSector, Name = "Friendly Faieries", ProductionCost = 100, SalesPrice = 150, License = customerLicense };
            var customerOrganization2 = new BusinessObjects.Organization() { Sector = customerSector, Name = "Clumsy Clowns", ProductionCost = 100, SalesPrice = 150, License = customerLicense };
            var customerUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = customerResourcePool, ResourcePoolRate = 101, TotalCostIndexRating = 0, KnowledgeIndexRating = 0, QualityIndexRating = 0, SectorIndexRating = 0, EmployeeSatisfactionIndexRating = 0, CustomerSatisfactionIndexRating = 100 };
            var customerUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 75, EmployeeSatisfactionRating = 0 };
            var customerUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0, QualityRating = 0, CustomerSatisfactionRating = 25, EmployeeSatisfactionRating = 0 };

            ResourcePoolRepository.Insert(customerResourcePool);
            SectorRepository.Insert(customerSector);
            LicenseRepository.Insert(customerLicense);
            OrganizationRepository.Insert(customerOrganization1);
            OrganizationRepository.Insert(customerOrganization2);
            UserResourcePoolRepository.Insert(customerUserResourcePool);
            UserOrganizationRepository.Insert(customerUserOrganization1);
            UserOrganizationRepository.Insert(customerUserOrganization2);
        }

        void AddAllInOneSample(BusinessObjects.User user)
        {
            var allInOneResourcePool = new BusinessObjects.ResourcePool() { Name = "All in One Sample", IsSample = true };
            var allInOneGenericSector = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "All in One Generic Sector" };
            var allInOneGenericLicense = new BusinessObjects.License() { ResourcePool = allInOneResourcePool, Name = "All in One Generic License", Text = "License Text" };
            var allInOneUserResourcePool = new BusinessObjects.UserResourcePool() { User = user, ResourcePool = allInOneResourcePool, ResourcePoolRate = 101, SectorIndexRating = 17, KnowledgeIndexRating = 17, TotalCostIndexRating = 17, QualityIndexRating = 17, EmployeeSatisfactionIndexRating = 15, CustomerSatisfactionIndexRating = 16 };
            var allInOneUserGenericSectorRating = new BusinessObjects.UserSectorRating() { User = user, Sector = allInOneGenericSector, Rating = 50 };
            var allInOneUserGenericLicenseRating = new BusinessObjects.UserLicenseRating() { User = user, License = allInOneGenericLicense, Rating = 50 };

            // Total Cost
            var allInOneTotalCostOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Lowlands", ProductionCost = 100, SalesPrice = 125, License = allInOneGenericLicense };
            var allInOneTotalCostOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "High Coast", ProductionCost = 100, SalesPrice = 175, License = allInOneGenericLicense };
            var allInOneUserTotalCostOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = allInOneTotalCostOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var allInOneUserTotalCostOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = allInOneTotalCostOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            
            // Knowledge
            var knowledgeLicense1 = new BusinessObjects.License() { ResourcePool = allInOneResourcePool, Name = "Open License", Description = "Open source license sample", Text = "When you use this license it allows everyone to use your license without any restriction" };
            var knowledgeLicense2 = new BusinessObjects.License() { ResourcePool = allInOneResourcePool, Name = "Restricted License", Description = "Restricted license sample", Text = "Can't, can't, can't" };
            var knowledgeOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "True Source", ProductionCost = 100, SalesPrice = 150, License = knowledgeLicense1 };
            var knowledgeOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Hidden Knowledge", ProductionCost = 100, SalesPrice = 150, License = knowledgeLicense2 };
            var knowledgeUserLicenseRating1 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense1, Rating = 75 };
            var knowledgeUserLicenseRating2 = new BusinessObjects.UserLicenseRating() { User = user, License = knowledgeLicense2, Rating = 25 };
            var knowledgeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var knowledgeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = knowledgeOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };

            // Quality
            var qualityOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Wealth's Finest", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var qualityOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Poor Beggar", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var qualityUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization1, NumberOfSales = 0, QualityRating = 75, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var qualityUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = qualityOrganization2, NumberOfSales = 0, QualityRating = 25, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };

            // Employee
            var employeeOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "One Big Family", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var employeeOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Reckless Ones", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var employeeUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 75 };
            var employeeUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = employeeOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 25 };

            // Customer
            var customerOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Friendly Faieries", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var customerOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Clumsy Clowns", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var customerUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 75, EmployeeSatisfactionRating = 50 };
            var customerUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = customerOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 25, EmployeeSatisfactionRating = 50 };

            // Sector
            var sectorSector1 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Basic Materials" };
            var sectorSector2 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Conglomerates" };
            var sectorSector3 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Consumer Goods" };
            var sectorSector4 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Financial" };
            var sectorSector5 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Healthcare" };
            var sectorSector6 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Industrial Goods" };
            var sectorSector7 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Services" };
            var sectorSector8 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Technology" };
            var sectorSector9 = new BusinessObjects.Sector() { ResourcePool = allInOneResourcePool, Name = "Utilities" };
            var sectorOrganization1 = new BusinessObjects.Organization() { Sector = sectorSector3, Name = "Basic Materials", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization2 = new BusinessObjects.Organization() { Sector = sectorSector7, Name = "Conglomerates", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization3 = new BusinessObjects.Organization() { Sector = sectorSector2, Name = "Consumer Goods", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization4 = new BusinessObjects.Organization() { Sector = sectorSector8, Name = "Financial", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization5 = new BusinessObjects.Organization() { Sector = sectorSector8, Name = "Healthcare", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization6 = new BusinessObjects.Organization() { Sector = sectorSector6, Name = "Industrial Goods", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization7 = new BusinessObjects.Organization() { Sector = sectorSector4, Name = "Services", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization8 = new BusinessObjects.Organization() { Sector = sectorSector5, Name = "Technology", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorOrganization9 = new BusinessObjects.Organization() { Sector = sectorSector1, Name = "Utilities", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var sectorUserSectorRating1 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector1, Rating = 12 };
            var sectorUserSectorRating2 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector2, Rating = 11 };
            var sectorUserSectorRating3 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector3, Rating = 11 };
            var sectorUserSectorRating4 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector4, Rating = 11 };
            var sectorUserSectorRating5 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector5, Rating = 11 };
            var sectorUserSectorRating6 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector6, Rating = 11 };
            var sectorUserSectorRating7 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector7, Rating = 11 };
            var sectorUserSectorRating8 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector8, Rating = 11 };
            var sectorUserSectorRating9 = new BusinessObjects.UserSectorRating() { User = user, Sector = sectorSector9, Rating = 11 };
            var sectorUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization3 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization3, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization4 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization4, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization5 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization5, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization6 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization6, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization7 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization7, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization8 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization8, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var sectorUserOrganization9 = new BusinessObjects.UserOrganization() { User = user, Organization = sectorOrganization9, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };

            // Distance
            var distanceOrganization1 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Home", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var distanceOrganization2 = new BusinessObjects.Organization() { Sector = allInOneGenericSector, Name = "Far Far Away Galaxy", ProductionCost = 100, SalesPrice = 150, License = allInOneGenericLicense };
            var distanceUserOrganization1 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization1, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };
            var distanceUserOrganization2 = new BusinessObjects.UserOrganization() { User = user, Organization = distanceOrganization2, NumberOfSales = 0, QualityRating = 50, CustomerSatisfactionRating = 50, EmployeeSatisfactionRating = 50 };

            // Insert
            ResourcePoolRepository.Insert(allInOneResourcePool);
            SectorRepository.Insert(allInOneGenericSector);
            LicenseRepository.Insert(allInOneGenericLicense);
            UserResourcePoolRepository.Insert(allInOneUserResourcePool);
            UserSectorRatingRepository.Insert(allInOneUserGenericSectorRating);
            UserLicenseRatingRepository.Insert(allInOneUserGenericLicenseRating);
            
            OrganizationRepository.Insert(allInOneTotalCostOrganization1);
            OrganizationRepository.Insert(allInOneTotalCostOrganization2);
            UserOrganizationRepository.Insert(allInOneUserTotalCostOrganization1);
            UserOrganizationRepository.Insert(allInOneUserTotalCostOrganization2);

            LicenseRepository.Insert(knowledgeLicense1);
            LicenseRepository.Insert(knowledgeLicense2);
            OrganizationRepository.Insert(knowledgeOrganization1);
            OrganizationRepository.Insert(knowledgeOrganization2);
            UserLicenseRatingRepository.Insert(knowledgeUserLicenseRating1);
            UserLicenseRatingRepository.Insert(knowledgeUserLicenseRating2);
            UserOrganizationRepository.Insert(knowledgeUserOrganization1);
            UserOrganizationRepository.Insert(knowledgeUserOrganization2);

            OrganizationRepository.Insert(qualityOrganization1);
            OrganizationRepository.Insert(qualityOrganization2);
            UserOrganizationRepository.Insert(qualityUserOrganization1);
            UserOrganizationRepository.Insert(qualityUserOrganization2);

            OrganizationRepository.Insert(employeeOrganization1);
            OrganizationRepository.Insert(employeeOrganization2);
            UserOrganizationRepository.Insert(employeeUserOrganization1);
            UserOrganizationRepository.Insert(employeeUserOrganization2);

            OrganizationRepository.Insert(customerOrganization1);
            OrganizationRepository.Insert(customerOrganization2);
            UserOrganizationRepository.Insert(customerUserOrganization1);
            UserOrganizationRepository.Insert(customerUserOrganization2);

            SectorRepository.Insert(sectorSector1);
            SectorRepository.Insert(sectorSector2);
            SectorRepository.Insert(sectorSector3);
            SectorRepository.Insert(sectorSector4);
            SectorRepository.Insert(sectorSector5);
            SectorRepository.Insert(sectorSector6);
            SectorRepository.Insert(sectorSector7);
            SectorRepository.Insert(sectorSector8);
            SectorRepository.Insert(sectorSector9);
            OrganizationRepository.Insert(sectorOrganization1);
            OrganizationRepository.Insert(sectorOrganization2);
            OrganizationRepository.Insert(sectorOrganization3);
            OrganizationRepository.Insert(sectorOrganization4);
            OrganizationRepository.Insert(sectorOrganization5);
            OrganizationRepository.Insert(sectorOrganization6);
            OrganizationRepository.Insert(sectorOrganization7);
            OrganizationRepository.Insert(sectorOrganization8);
            OrganizationRepository.Insert(sectorOrganization9);
            UserSectorRatingRepository.Insert(sectorUserSectorRating1);
            UserSectorRatingRepository.Insert(sectorUserSectorRating2);
            UserSectorRatingRepository.Insert(sectorUserSectorRating3);
            UserSectorRatingRepository.Insert(sectorUserSectorRating4);
            UserSectorRatingRepository.Insert(sectorUserSectorRating5);
            UserSectorRatingRepository.Insert(sectorUserSectorRating6);
            UserSectorRatingRepository.Insert(sectorUserSectorRating7);
            UserSectorRatingRepository.Insert(sectorUserSectorRating8);
            UserSectorRatingRepository.Insert(sectorUserSectorRating9);
            UserOrganizationRepository.Insert(sectorUserOrganization1);
            UserOrganizationRepository.Insert(sectorUserOrganization2);
            UserOrganizationRepository.Insert(sectorUserOrganization3);
            UserOrganizationRepository.Insert(sectorUserOrganization4);
            UserOrganizationRepository.Insert(sectorUserOrganization5);
            UserOrganizationRepository.Insert(sectorUserOrganization6);
            UserOrganizationRepository.Insert(sectorUserOrganization7);
            UserOrganizationRepository.Insert(sectorUserOrganization8);
            UserOrganizationRepository.Insert(sectorUserOrganization9);
            
            OrganizationRepository.Insert(distanceOrganization1);
            OrganizationRepository.Insert(distanceOrganization2);
            UserOrganizationRepository.Insert(distanceUserOrganization1);
            UserOrganizationRepository.Insert(distanceUserOrganization2);
        }
    }
}
