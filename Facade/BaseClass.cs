using BusinessObjects;
using DataObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Facade
{
    public abstract class BaseClass
    {
        public virtual void InsertOrUpdate(License license)
        {
        
        }
    }

    public class LicenseClass : BaseClass
    {
        public void Test()
        {
            // base.InsertOrUpdate();
        }

        public override void InsertOrUpdate(License license)
        {
            base.InsertOrUpdate(license);


        }
    }
}
