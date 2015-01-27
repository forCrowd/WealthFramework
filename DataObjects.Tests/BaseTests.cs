using BusinessObjects;
using System;

namespace DataObjects.Tests
{
    public abstract class BaseTests : IDisposable
    {
        public WealthEconomyContext Context { get; private set; }

        public BaseTests()
        {
            SetNewContext();
        }

        public void RefreshContext()
        {
            SetNewContext();
        }

        public void Dispose()
        {
            Context.Dispose();
        }

        void SetNewContext()
        {
            Context = new WealthEconomyContext();
        }
    }
}
