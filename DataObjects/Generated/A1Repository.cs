namespace DataObjects
{
    using BusinessObjects;

    public partial class A1Repository : BaseRepository<A1>
    {
        public A1Repository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
