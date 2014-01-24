using System;

namespace BusinessObjects
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class TestAttribute : Attribute
    {
        public TestAttribute(bool isTest)
        {
            IsTest = isTest;
        }

        public bool IsTest { get; private set; }
    }
}
