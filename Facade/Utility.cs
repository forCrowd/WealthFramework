using forCrowd.WealthEconomy.BusinessObjects;
using forCrowd.WealthEconomy.DataObjects;
using Microsoft.Data.Edm;

namespace forCrowd.WealthEconomy.Facade
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