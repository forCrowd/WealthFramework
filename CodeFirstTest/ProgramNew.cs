using DataObjects;
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
            using (var db = new DataObjects.WealthEconomyEntities())
            {
                Console.WriteLine(db.Database.Connection.ConnectionString);

                //var newUser = new BusinessObjects.User() { Email = "test user", CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                ////var newOrganization = new BusinessObjects.Organization() { Name = "Organization 2", License = newLicense };

                //db.User.Add(newUser);
                //// db.License.Add(newLicense);
                ////db.Organization.Add(newOrganization);

                //db.SaveChanges();

                XElement rootElement;
                // IEdmModel model;

                using (var stream = new MemoryStream())
                {
                    using (var writer = XmlWriter.Create(stream))
                    {
                        System.Data.Entity.Infrastructure.EdmxWriter.WriteEdmx(db, writer);
                    }
                    stream.Position = 0;

                    //var root = XElement.Load(sourcePath, LoadOptions.SetBaseUri | LoadOptions.SetLineInfo);
                    var root = XElement.Load(stream, LoadOptions.SetBaseUri | LoadOptions.SetLineInfo);
                    rootElement = root.Elements()
                        .Where(e => e.Name.LocalName == "Runtime")
                        .Elements()
                        .Where(e => e.Name.LocalName == "ConceptualModels")
                        .Elements()
                        .Where(e => e.Name.LocalName == "Schema")
                        .FirstOrDefault()
                            ?? root;

                    //using (var reader = XmlReader.Create(stream))
                    //{
                    //    model = EdmxReader.Parse(reader);
                    //}
                }

                Console.WriteLine(rootElement);

            }

            Console.ReadKey();
        }
    }
}
