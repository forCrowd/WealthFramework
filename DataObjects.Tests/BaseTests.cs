using BusinessObjects;
using System;

namespace DataObjects.Tests
{
    public abstract class BaseTests : IDisposable
    {
        public WealthEconomyContext Context { get; private set; }

        public BaseTests()
        {
            Context = new WealthEconomyContext();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
