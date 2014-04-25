using System;

namespace BusinessObjects.Metadata.Attributes
{
    public class DefaultPropertyAttribute : Attribute
    {
        public DefaultPropertyAttribute(string value)
        {
            Value = value;
        }

        public string Value { get; private set; }
    }
}
