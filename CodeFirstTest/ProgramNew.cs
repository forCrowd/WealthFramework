using Microsoft.Data.Edm;
using Microsoft.Data.Edm.Csdl;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace CodeFirstTest
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var db = new DataObjects.WealthEconomyContext())
            {
                var newUser = new BusinessObjects.User() { Email = "test user", CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                //var newOrganization = new BusinessObjects.Organization() { Name = "Organization 2", License = newLicense };

                db.User.Add(newUser);
                // db.License.Add(newLicense);
                //db.Organization.Add(newOrganization);

                db.SaveChanges();
            }

            Console.ReadKey();
        }
    }
}
