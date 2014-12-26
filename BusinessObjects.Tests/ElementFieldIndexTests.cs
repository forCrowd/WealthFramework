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
            new ResourcePool("CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.Boolean, true)
                .AddIndex("Index", RatingSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullOrDefaultException))]
        public void NewElementFieldIndexWithInvalidConstructor_Exception()
        {
            new ResourcePool("CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.String)
                .AddIndex(string.Empty, RatingSortType.HighestToLowest);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void NewElementFieldIndexOnStringType_Exception()
        {
            new ResourcePool("CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldTypes.String)
                .AddIndex("Index", RatingSortType.HighestToLowest);
        }
    }
}
