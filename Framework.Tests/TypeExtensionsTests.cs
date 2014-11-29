using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Framework.Tests
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
            string test = default(string);
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void String_HasValue_ShouldBeFalse()
        {
            string test = "test";
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
            int? test = default(int);
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
        public void Int_Default_ShouldBeTrue()
        {
            int test = default(int);
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void Int_0_ShouldBeTrue()
        {
            int test = 0;
            Assert.IsTrue(test.IsNullOrDefault());
        }

        [TestMethod]
        public void Int_HasValue_ShouldBeFalse()
        {
            int test = 1;
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
            Object test = new Object();
            Assert.IsTrue(!test.IsNullOrDefault());
        }

        #endregion
    }
}
