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

        public class ODataContext : WealthEconomyContext
        {
            protected override void OnModelCreating(System.Data.Entity.DbModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                //modelBuilder.Entity<Element>()
                //    .Map(item => item.y(prop => prop.TestProp));

                // modelBuilder.Entity<Element>().Property(x => x.TestProp).
            }

        }
    }
}