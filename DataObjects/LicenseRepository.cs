namespace DataObjects
{
    using BusinessObjects;

    public partial class LicenseRepository : GenericRepository<License, short>
    {
        public LicenseRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
