using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.Framework.Tests
{
    [TestClass]
    public class ValidationTests
    {
        [TestMethod]
        public void String_Empty_ShouldFail()
        {
            var test = string.Empty;
            Validate(test);
        }

        [TestMethod]
        public void String_Whitespace_ShouldFail()
        {
            var test = " ";
            Validate(test);
        }

        [TestMethod]
        public void String_HasValue_ShouldPass()
        {
            var test = "test";
            Validate(test, false);
        }

        [TestMethod]
        public void NullableInt_Default_ShouldFail()
        {
            int? test = default(int); // null
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
        public void Int_0_ShouldFail()
        {
            var test = 0;
            Validate(test);
        }

        [TestMethod]
        public void Int_Default_ShouldFail()
        {
            var test = default(int); // 0
            Validate(test);
        }

        [TestMethod]
        public void Int_HasValue_ShouldPass()
        {
            var test = 1;
            Validate(test, false);
        }

        [TestMethod]
        public void Object_HasValue_ShouldPass()
        {
            var test = new Object();
            Validate(test, false);
        }

        // For classes and structs, except nullables
        private void Validate<T>(T test, bool isNullOrDefault = true)
        {
            try
            {
                Validations.ArgumentNullOrDefault(test, nameof(test));

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

        // For nullables
        private void Validate<T>(T? test, bool isNullOrDefault = true) where T : struct
        {
            try
            {
                Validations.ArgumentNullOrDefault(test, nameof(test));

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
