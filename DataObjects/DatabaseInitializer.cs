namespace BusinessObjects
{
    using DataObjects.Migrations;
    using System.Data.Entity;

    public static class DatabaseInitializer
    {
        public static void Initialize()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<WealthEconomyContext, Configuration>());
        }
    }
}
