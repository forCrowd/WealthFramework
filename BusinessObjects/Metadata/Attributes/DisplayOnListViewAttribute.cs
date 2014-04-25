using System;

namespace BusinessObjects.Metadata.Attributes
{
    public class DisplayOnListViewAttribute : Attribute
    {
        public DisplayOnListViewAttribute(bool value)
        {
            Value = value;
        }

        public bool Value { get; private set; }
    }
}
