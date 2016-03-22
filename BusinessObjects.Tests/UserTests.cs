using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class UserTests
    {
        [TestMethod]
        public void NewUser_ShouldCreate()
        {
            new User("A valid username?", "A valid email address?");
        }
    }
}
