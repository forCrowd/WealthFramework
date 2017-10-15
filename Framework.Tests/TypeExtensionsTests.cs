using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.Framework.Tests
{
    [TestClass]
    public class TypeExtensionsTests
    {
        #region - IsNullOrDefault -

        [TestMethod]
        public void String_Null_ShouldBeTrue()
        {
            string test = null;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void String_Default_ShouldBeTrue()
        {
            var test = default(string); // null
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void String_Empty_ShouldBeTrue()
        {
            var test = string.Empty;
            Assert.IsTrue(test.IsNullOrDefault());            
        }

        [TestMethod]
        public void String_Whitespace_ShouldBeTrue()
        {
            var test = " ";
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void String_HasValue_ShouldBeFalse()
        {
            var test = "test";
            Assert.IsTrue(!test.IsNullOrDefault());
        }

        [TestMethod]
        public void NullableInt_Null_ShouldBeTrue()
        {
            int? test = null;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void NullableInt_Default_ShouldBeTrue()
        {
            var test = default(int?); // null
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void NullableInt_0_ShouldBeTrue()
        {
            int? test = 0;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void NullableInt_HasValue_ShouldBeFalse()
        {
            int? test = 1;
            Assert.IsTrue(!test.IsNullOrDefault());
        }

        [TestMethod]
        public void Int_0_ShouldBeTrue()
        {
            var test = 0;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void Int_Default_ShouldBeTrue()
        {
            var test = default(int); // 0
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void Int_HasValue_ShouldBeFalse()
        {
            var test = 1;
            Assert.IsTrue(!test.IsNullOrDefault());
        }

        [TestMethod]
        public void Object_Null_ShouldBeTrue()
        {
            Object test = null;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void Object_HasValue_ShouldBeFalse()
        {
            var test = new Object();
            Assert.IsTrue(!test.IsNullOrDefault());
        }

        #endregion
    }
}
