using Facade;

namespace Web
{
    public static class DatabaseConfig
    {
        public static void Initialize()
        {
            Utility.MigrateDatabaseToLatestVersion();
        }
    }
}
