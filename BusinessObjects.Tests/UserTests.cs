using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserTests
    {
        [TestMethod]
        public void NewUser_ShouldCreate()
        {
            new User("a valid email address?");
        }
    }
}
