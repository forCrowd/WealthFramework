namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class SectorUnitOfWork
    {
        public override void Delete(params object[] id)
        {
            var sector = Find(id);

            // Delete child items first
            new UserSectorRatingRepository(Context).DeleteRange(sector.UserSectorRatingSet);

            // Delete main item
            base.Delete(id);
        }
    }
}