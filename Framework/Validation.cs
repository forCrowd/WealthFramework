using System;
using System.Collections.Generic;
using System.Linq;

namespace Framework
{
    public static class Validation
    {
        public static void ArgumentNotNull<T>(T arg) where T : class
        {
            if (arg == null)
            {
                throw new ArgumentNullException(arg.GetType().GetProperties()[0].Name);
            }
        }
    }
}
