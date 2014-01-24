namespace DataObjects
{
    using BusinessObjects;

    public partial class SectorRepository : GenericRepository<Sector, byte>
    {
        public SectorRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
