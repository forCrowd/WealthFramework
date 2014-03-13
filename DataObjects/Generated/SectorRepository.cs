namespace DataObjects
{
    using BusinessObjects;

    public partial class SectorRepository : GenericRepository<Sector>
    {
        public SectorRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
