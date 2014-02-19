namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    /// <summary>
    /// Abstract class for all the managers (facades).
    /// </summary>
    /// <typeparam name="TBusinessObject">Generic type representing the business object.</typeparam>	
    public class OrganizationUnitOfWork : IDisposable
    {
        WealthEconomyEntities context;
        OrganizationRepository organizationRepository;

        public OrganizationUnitOfWork(WealthEconomyEntities context)
        {
            // TODO Fix this! This costructor should be hidden + should not take parameter
            // context = new WealthEconomyEntities();
            this.context = context;
        }

        public OrganizationRepository OrganizationRepository
        {
            get
            {
                if (organizationRepository == null)
                    organizationRepository = new OrganizationRepository(context);
                return organizationRepository;
            }
        }

        public void Save()
        {
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #region - Sample Organizations -

        public Organization GetTotalCostIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "TCI - 1x", ProductionCost = 100, SalesPrice = 100, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetTotalCostIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "TCI - 4x", ProductionCost = 100, SalesPrice = 500, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetKnowledgeIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 1);
            return new Organization() { User = user, Sector = sector, Name = "KI - True Source", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetKnowledgeIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "KI - Hidden Knowledge", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetQualityIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "QI - Wealth's Finest", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetQualityIndexOrganizationRating1(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 80, EmployeeSatisfactionRating = 0, CustomerSatisfactionRating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetQualityIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "QI - Poor Beggar", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetQualityIndexOrganizationRating2(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 20, EmployeeSatisfactionRating = 0, CustomerSatisfactionRating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetEmployeeSatisfactionIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "ESI - One Big Family", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetEmployeeSatisfactionIndexOrganizationRating1(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 0, EmployeeSatisfactionRating = 80, CustomerSatisfactionRating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetEmployeeSatisfactionIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "ESI - Reckless Ones", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetEmployeeSatisfactionIndexOrganizationRating2(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 0, EmployeeSatisfactionRating = 20, CustomerSatisfactionRating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetCustomerSatisfactionIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "CSI - Friendly Faieries", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetCustomerSatisfactionIndexOrganizationRating1(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 0, EmployeeSatisfactionRating = 0, CustomerSatisfactionRating = 80, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetCustomerSatisfactionIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "CSI - Clumsy Clowns", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public UserOrganizationRating GetCustomerSatisfactionIndexOrganizationRating2(User user, Organization organization)
        {
            return new UserOrganizationRating() { User = user, Organization = organization, QualityRating = 0, EmployeeSatisfactionRating = 0, CustomerSatisfactionRating = 20, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Utilities", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 2);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Consumer Goods", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization3(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 3);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Basic Materials", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization4(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 4);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Services", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization5(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 5);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Technology", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization6(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 6);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Industrial Goods", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization7(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 7);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Conglomerates", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization8(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 8);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Financial", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetSectorIndexOrganization9(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 9);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "SI - Healthcare", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetDistanceIndexOrganization1(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "DI - Home", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        public Organization GetDistanceIndexOrganization2(User user)
        {
            var sector = context.SectorSet.Single(s => s.Id == 1);
            var license = context.LicenseSet.Single(l => l.Id == 2);
            return new Organization() { User = user, Sector = sector, Name = "DI - Far Far Away Galaxy", ProductionCost = 100, SalesPrice = 200, License = license, NumberOfSales = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
        }

        #endregion
    }
}
