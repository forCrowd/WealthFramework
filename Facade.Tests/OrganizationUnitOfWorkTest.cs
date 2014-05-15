namespace Facade.Tests
{
    using BusinessObjects;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    [TestClass]
    public class OrganizationUnitOfWorkTest
    {
        [TestMethod]
        public void Select()
        {
            using (var unitOfWork = new OrganizationUnitOfWork())
            {
                var list = unitOfWork.AllLive.Take(10);
                foreach (var item in list)
                {
                    Console.WriteLine(item.Name);
                }
            }
        }

        [TestMethod]
        public void Insert()
        {
            Sector sampleSector;
            using (var unitOfWork = new SectorUnitOfWork())
                sampleSector = unitOfWork.AllLive.First();

            License sampleLicense;
            using (var unitOfWork = new LicenseUnitOfWork())
                sampleLicense = unitOfWork.AllLive.First();

            User sampleUser;
            using (var unitOfWork = new UserUnitOfWork())
                sampleUser = unitOfWork.AllLive.First();

            using (var unitOfWork = new OrganizationUnitOfWork())
            {
                var organization = new Organization()
                {
                    SectorId = sampleSector.Id,
                    Name = "Test organization",
                    ProductionCost = 0,
                    SalesPrice = 0,
                    LicenseId = sampleLicense.Id
                };

                unitOfWork.Insert(organization, sampleUser.Id);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Update()
        {
            using (var unitOfWork = new OrganizationUnitOfWork())
            {
                var organization = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                organization.Name += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

                unitOfWork.Update(organization);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Delete()
        {
            using (var unitOfWork = new OrganizationUnitOfWork())
            {
                var organization = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

                unitOfWork.Delete(organization.Id);
                unitOfWork.Save();
            }
        }
    }
}
