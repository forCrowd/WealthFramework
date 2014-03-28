using DataObjects;
using Microsoft.Data.Edm;

namespace Facade
{
    public static class Utility
    {
        public static IEdmModel GetEdmModel()
        {
            return EdmBuilder.GetModelFirstEdm<WealthEconomyEntities>();
        }
    }
}