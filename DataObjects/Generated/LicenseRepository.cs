namespace DataObjects
{
    using BusinessObjects;

    public partial class LicenseRepository : GenericRepository<License>
    {
        public LicenseRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
