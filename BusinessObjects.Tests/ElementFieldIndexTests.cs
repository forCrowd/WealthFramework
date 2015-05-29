using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Framework.Exceptions;

namespace BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldIndexTests
    {
        [TestMethod]
        public void NewElementFieldIndex_ShouldCreate()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.Boolean, true)
                .AddIndex(RatingSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullOrDefaultException))]
        public void NewElementFieldIndexWithInvalidConstructor_Exception()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.String)
                .AddIndex(RatingSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void NewElementFieldIndexOnStringType_Exception()
        {
            var user = new User("User");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.String)
                .AddIndex(RatingSortType.HighestToLowest);
        }
    }
}
