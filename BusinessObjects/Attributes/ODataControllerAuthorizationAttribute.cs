using System;

namespace BusinessObjects.Attributes
{
    /// <summary>
    /// If specified, ODataControllers will be generated with this Authorization Role
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class ODataControllerAuthorizationAttribute : Attribute
    {
        public ODataControllerAuthorizationAttribute(string value)
        {
            Value = value;
        }

        public string Value { get; private set; }
    }
}
