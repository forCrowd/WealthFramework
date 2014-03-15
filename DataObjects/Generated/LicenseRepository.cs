namespace DataObjects
{
    using BusinessObjects;

    public partial class LicenseRepository : BaseRepository<License>
    {
        public LicenseRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
