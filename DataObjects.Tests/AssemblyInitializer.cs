using forCrowd.WealthEconomy.BusinessObjects;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.DataObjects.Tests
{
    [TestClass]
    public static class AssemblyInitializer
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext context)
        {
            context.WriteLine("Assembly initializing");

            DatabaseInitializer.Initialize(true);
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
        }
    }
}
