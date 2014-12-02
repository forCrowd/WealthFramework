using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserTests
    {
        [TestMethod]
        public void NewUserShouldCreate()
        {
            var newUser = new User("a valid email address?");
        }
    }
}
