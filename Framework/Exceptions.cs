using System;
using System.Runtime.Serialization;

namespace forCrowd.WealthEconomy.Framework.Exceptions
{
    /// <summary>
    /// The exception that is thrown when a null reference, default or empty value is passed to a method that does not accept it as a valid argument.
    /// REMARK: When this exception occurs within Update-Database operation of Entity Framework migrations,
    /// it fails to load it and display 'Type is not resolved for member 'forCrowd.WealthEconomy.Framework.ArgumentNullOrDefaultException ...' message.
    /// TODO Probably this exception needs to be installed to GAC to resolve this issue?
    /// </summary>
    [Serializable]
    public class ArgumentNullOrDefaultException : ArgumentNullException, ISerializable
    {
        public ArgumentNullOrDefaultException() : base() { }
        public ArgumentNullOrDefaultException(string paramName) : base(paramName) { }
        protected ArgumentNullOrDefaultException(SerializationInfo info, StreamingContext context) : base(info, context) { }
        public ArgumentNullOrDefaultException(string message, Exception innerException) : base(message, innerException) { }
        public ArgumentNullOrDefaultException(string paramName, string message) : base(paramName, message) { }

        public override string Message
        {
            get
            {
                return "Value cannot be null or has a default value.";
            }
        }
    }
}
