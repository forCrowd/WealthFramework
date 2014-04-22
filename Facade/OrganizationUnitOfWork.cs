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
            var userOrganizationRepository = new UserOrganizationRepository(Context);
            userOrganizationRepository.DeleteRange(organization.UserOrganizationSet);

            // Delete main item
            base.Delete(id);
        }
    }
}