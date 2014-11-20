using BusinessObjects;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DataObjects.Tests
{
    [TestClass]
    public static class AssemblyInitializer
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext context)
        {
            DatabaseInitializer.Initialize(false);
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
        }
    }
}
