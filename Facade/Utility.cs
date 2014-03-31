using DataObjects;
using Microsoft.Data.Edm;

namespace Facade
{
    public static class Utility
    {
        public static IEdmModel GetWealthEconomyEntitiesEdm()
        {
            return EdmBuilder.GetEdm<WealthEconomyEntities>();
        }
    }
}