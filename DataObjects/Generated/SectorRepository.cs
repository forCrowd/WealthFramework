namespace DataObjects
{
    using BusinessObjects;

    public partial class SectorRepository : BaseRepository<Sector>
    {
        public SectorRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
