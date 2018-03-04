namespace forCrowd.WealthEconomy.DataObjects
{
    using System.Data.Entity;

    public static class DatabaseInitializer
    {
        public static void Initialize(bool isTest = false)
        {
            // var initializer = new MigrateDatabaseToLatestVersion(isTest);
            var initializer = new CreateDatabaseIfNotExists<BusinessObjects.Entities.WealthEconomyContext>();
            Database.SetInitializer(initializer);
        }
    }
}
