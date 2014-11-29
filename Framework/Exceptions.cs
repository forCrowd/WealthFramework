using System;
using System.Collections.Generic;
using System.Linq;

namespace Framework
{
    public class ArgumentNullOrDefaultException : ArgumentNullException
    {
        public ArgumentNullOrDefaultException() : base() { }
        public ArgumentNullOrDefaultException(string paramName) : base(paramName) { }
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
