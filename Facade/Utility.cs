using BusinessObjects;
using DataObjects;
using Microsoft.Data.Edm;

namespace Facade
{
    // Misc. method for the application
    // TODO Categorize them better ?!
    public static class DbUtility
    {
        public static void InitializeDatabase()
        {
            DatabaseInitializer.Initialize();
        }

        public static IEdmModel GetWealthEconomyContextEdm()
        {
            return EdmBuilder.GetEdm<WealthEconomyContext>();
        }
    }
}