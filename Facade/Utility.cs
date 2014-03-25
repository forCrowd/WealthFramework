using DataObjects;
using Framework;
using Microsoft.Data.Edm;

namespace Facade
{
    public static class Utility
    {
        public static IEdmModel GetEdmModel()
        {
            return EdmModelBuilder.GetModelFirstEdmModel<WealthEconomyEntities>();
        }
    }
}