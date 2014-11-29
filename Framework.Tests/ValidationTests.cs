using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Framework.Tests
{
    [TestClass]
    public class ValidationTests
    {
        [TestMethod]
        public void String_Null_ShouldFail()
        {
            string test = null;
            Validate(test);
        }

        [TestMethod]
        public void String_Default_ShouldFail()
        {
            string test = default(string);
            Validate(test);
        }

        [TestMethod]
        public void String_HasValue_ShouldPass()
        {
            string test = "test";
            Validate(test, false);
        }

        [TestMethod]
        public void NullableInt_Null_ShouldFail()
        {
            int? test = null;
            Validate(test);
        }

        [TestMethod]
        public void NullableInt_Default_ShouldFail()
        {
            int? test = default(int);
            Validate(test);
        }

        [TestMethod]
        public void NullableInt_0_ShouldFail()
        {
            int? test = 0;
            Validate(test);
        }

        [TestMethod]
        public void NullableInt_HasValue_ShouldPass()
        {
            int? test = 1;
            Validate(test, false);
        }

        [TestMethod]
        public void Int_Default_ShouldFail()
        {
            int test = default(int);
            Validate(test);
        }

        [TestMethod]
        public void Int_0_ShouldFail()
        {
            int test = 0;
            Validate(test);
        }

        [TestMethod]
        public void Int_HasValue_ShouldPass()
        {
            int test = 1;
            Validate(test, false);
        }

        [TestMethod]
        public void Object_Null_ShouldFail()
        {
            Object test = null;
            Validate(test);
        }

        [TestMethod]
        public void Object_HasValue_ShouldPass()
        {
            Object test = new Object();
            Validate(test, false);
        }

        void Validate<T>(T test, bool isNullOrDefault = true)
        {
            try
            {
                Framework.Validation.ArgumentNullOrDefault(test, "test");

                if (isNullOrDefault)
                    Assert.Fail();
            }
            catch (ArgumentNullOrDefaultException ex)
            {
                if (!isNullOrDefault)
                    Assert.Fail();

                Assert.IsTrue(ex.ParamName == "test");
            }
        }

        void Validate<T>(T? test, bool isNullOrDefault = true) where T : struct
        {
            try
            {
                Framework.Validation.ArgumentNullOrDefault(test, "test");

                if (isNullOrDefault)
                    Assert.Fail();
            }
            catch (ArgumentNullOrDefaultException ex)
            {
                if (!isNullOrDefault)
                    Assert.Fail();

                Assert.IsTrue(ex.ParamName == "test");
            }
        }
    }
}
