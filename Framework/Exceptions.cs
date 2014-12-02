using System;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Security;

namespace Framework
{
    // Summary:
    //     The exception that is thrown when a null reference, default or empty value 
    //     is passed to a method that does not accept it as a valid argument.
    [Serializable]
    [ComVisible(true)]
    public class ArgumentNullOrDefaultException : ArgumentNullException
    //public class ArgumentNullOrDefaultException : Exception
    {
        public ArgumentNullOrDefaultException() : base() { }
        public ArgumentNullOrDefaultException(string paramName) : base(paramName) { }
        [SecurityCritical]
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
