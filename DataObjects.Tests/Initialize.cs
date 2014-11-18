using BusinessObjects;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;

namespace DataObjects.Tests
{
    public static class Initialize
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext context)
        {
            DatabaseInitializer.Initialize(false);
        }
    }
}
