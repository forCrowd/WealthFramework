namespace Facade.Tests
{
    using BusinessObjects;
    using Facade;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Linq;

    [TestClass]
    public class LicenseUnitOfWorkTest
    {
        [TestMethod]
        public void Select()
        {
            using (var unitOfWork = new LicenseUnitOfWork())
            {
                var licenses = unitOfWork.AllLive.AsEnumerable();
            }
        }

        [TestMethod]
        public void Insert()
        {
            ResourcePool sampleResourcePool;
            using (var unitOfWork = new ResourcePoolUnitOfWork())
                sampleResourcePool = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

            using (var unitOfWork = new LicenseUnitOfWork())
            {
                var license = new License()
                {
                    ResourcePool = sampleResourcePool,
                    Name = "New license",
                    Text = "Text of new license"
                };

                unitOfWork.Insert(license);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Update()
        {
            using (var unitOfWork = new LicenseUnitOfWork())
            {
                var license = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();
                license.Description += string.Format("{0}Update test: {1:yyyyMMdd_HHmmss}", Environment.NewLine, DateTime.Now);

                unitOfWork.Update(license);
                unitOfWork.Save();
            }
        }

        [TestMethod]
        public void Delete()
        {
            using (var unitOfWork = new LicenseUnitOfWork())
            {
                var license = unitOfWork.AllLive.OrderByDescending(item => item.CreatedOn).First();

                unitOfWork.Delete(license.Id);
                unitOfWork.Save();
            }
        }
    }
}
