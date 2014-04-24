//using Microsoft.Data.Edm;
//using Microsoft.Data.Edm.Csdl;
//using System;
//using System.Collections.Generic;
//using System.Data.SqlClient;
//using System.IO;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using System.Xml;
//using System.Xml.Linq;

//namespace CodeFirstTest
//{
//    class Program
//    {
//        static void Main(string[] args)
//        {
//            //using (var db = new CodeFirstContext())
//            //{
//            //    var newLicense = new License() { Name = "License 2xxx" };
//            //    var newOrganization = new Organization() { Name = "Organization 2", License = newLicense };

//            //    db.LicenseSet.Add(newLicense);
//            //    db.OrganizationSet.Add(newOrganization);

//            //    db.SaveChanges();
//            //}

//            // System.Configuration.ConfigurationManager.co

//            //System.Configuration.ConfigurationManager.ConnectionStrings.Add(
//            //    new System.Configuration.ConnectionStringSettings("CodeFirstContext",
//            //        "Data Source=(LocalDb)\v11.0;Initial Catalog=CodeFirstDb;Integrated Security=SSPI",
//            //        "System.Data.SqlClient"));

//            // var x = Microsoft.Data.Edm.EdmBuilder.GetEdm<CodeFirstContext>();
//            XElement rootElement;
//            using (var db = new CodeFirstContext("Server=(LocalDb)\\v11.0;Database=CodeFirstDb;Integrated Security=True;"))
//            {
//                // IEdmModel model;

//                using (var stream = new MemoryStream())
//                {
//                    using (var writer = XmlWriter.Create(stream))
//                    {
//                        System.Data.Entity.Infrastructure.EdmxWriter.WriteEdmx(db, writer);
//                    }
//                    stream.Position = 0;

//                    //var root = XElement.Load(sourcePath, LoadOptions.SetBaseUri | LoadOptions.SetLineInfo);
//                    var root = XElement.Load(stream, LoadOptions.SetBaseUri | LoadOptions.SetLineInfo);
//                    rootElement = root.Elements()
//                        .Where(e => e.Name.LocalName == "Runtime")
//                        .Elements()
//                        .Where(e => e.Name.LocalName == "ConceptualModels")
//                        .Elements()
//                        .Where(e => e.Name.LocalName == "Schema")
//                        .FirstOrDefault()
//                            ?? root;

//                    //using (var reader = XmlReader.Create(stream))
//                    //{
//                    //    model = EdmxReader.Parse(reader);
//                    //}
//                }
//            }

//            Console.WriteLine(rootElement);
//            Console.ReadKey();
//        }
//    }
//}
