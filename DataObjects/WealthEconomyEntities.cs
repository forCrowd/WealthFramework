namespace DataObjects
{
    using System.Data.Entity;

    public partial class WealthEconomyEntities2 : DbContext
    {
        public WealthEconomyEntities2(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }
    }
}
