using System;

namespace BusinessObjects.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DisplayOnListViewAttribute : Attribute
    {
        public DisplayOnListViewAttribute(bool value)
        {
            Value = value;
        }

        public bool Value { get; private set; }
    }
}
