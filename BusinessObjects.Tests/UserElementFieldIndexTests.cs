using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class UserElementFieldIndexTests
    {
        [TestMethod]
        public void NewUserElementFieldIndex_ShouldCreate()
        {
            var newUser = new User("Email");

            var newResourcePool = new ResourcePool("CMRP");

            var newIndex = newResourcePool
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.Boolean, true)
                .AddIndex("Index", RatingSortType.HighestToLowest);

            newResourcePool
                .AddUserResourcePool(newUser, 0)
                .AddIndex(newIndex, 0);
        }
    }
}
