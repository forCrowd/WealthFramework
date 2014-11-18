namespace BusinessObjects
{
    using DataObjects.Migrations;
    using System.Data.Entity;

    public static class DatabaseInitializer
    {
        public static void Initialize()
        {
        }

        public static void Initialize(bool liveDatabase = true)
        {
            var initializer = liveDatabase
                ? (IDatabaseInitializer<WealthEconomyContext>) new MigrateDatabaseToLatestVersion<WealthEconomyContext, Configuration>()
                : (IDatabaseInitializer<WealthEconomyContext>) new DropCreateDatabaseAlways<WealthEconomyContext>();
            
            Database.SetInitializer(initializer);
        }
    }
}
