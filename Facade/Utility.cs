using DataObjects;
using Microsoft.Data.Edm;
using System.Data.Entity;

namespace Facade
{
    // Misc. method for the application
    // TODO Categorize them better ?!
    public static class Utility
    {
        public static IEdmModel GetWealthEconomyContextEdm()
        {
            return EdmBuilder.GetEdm<WealthEconomyContext>();
        }

        public static void MigrateDatabaseToLatestVersion()
        {
            WealthEconomyContext.MigrateDatabaseToLatestVersion();
        }
    }
}