namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;

    public partial class OrganizationUnitOfWork
    {
        LicenseRepository licenseRepository;
        SectorRepository sectorRepository;

        LicenseRepository LicenseRepository
        {
            get { return licenseRepository ?? (licenseRepository = new LicenseRepository(Context)); }
        }

        SectorRepository SectorRepository
        {
            get { return sectorRepository ?? (sectorRepository = new SectorRepository(Context)); }
        }

        public IQueryable<License> LicenseSetLive { get { return LicenseRepository.AllLive; } }

        public IQueryable<Sector> SectorSetLive { get { return SectorRepository.AllLive; } }

        public override void Delete(params object[] id)
        {
            var organization = Find(id);

            // Delete child items first
            var userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context);
            var resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(Context);

            var resourceOrganizationSet = organization.ResourcePoolOrganizationSet;
            foreach (var item in resourceOrganizationSet)
                userResourcePoolOrganizationRepository.DeleteRange(item.UserResourcePoolOrganizationSet);
            resourcePoolOrganizationRepository.DeleteRange(resourceOrganizationSet);

            // Delete main item
            base.Delete(id);
        }
    }
}