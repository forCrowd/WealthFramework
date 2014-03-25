//using BusinessObjects;
//using System.Data.Entity;
//using System.Web.Http;
//using System.Web.Http.OData.Batch;
//using System.Web.Http.OData.Builder;
//using Microsoft.Data.Edm;
//using System.Data.Entity.Core.Objects;
//using System.Data.Entity.Core.Metadata.Edm;
//using System.Data.Entity.Infrastructure;
//using System.Linq;
//using ODataServices;
//using DataObjects;

//namespace Web
//{
//    public class EFContextProvider : Breeze.ContextProvider.EF6.EFContextProvider<DataObjects.WealthEconomyEntities>
//    {
//        public EFContextProvider() : base() { }
//    }

//    public static class WebApiConfig
//    {
//        public static void Register(HttpConfiguration config)
//        {
//            // Web API configuration and services

//            // This is already on?
//            //config.EnableQuerySupport();

//            // Web API routes
//            config.MapHttpAttributeRoutes();

//            // Xml
//            var edmx = System.Xml.XmlReader.Create(System.Web.HttpContext.Current.Server.MapPath("Model.edmx"));
//            var csdl = Microsoft.Data.Edm.Csdl.EdmxReader.Parse(edmx);

//            //config.Routes.MapODataRoute(
//            //    routeName: "odata",
//            //    routePrefix: "odata",
//            //    model: csdl,
//            //    batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
//            //    );

//            config.Routes.MapHttpRoute(
//                name: "DefaultApi",
//                routeTemplate: "api/{controller}/{id}",
//                defaults: new { id = RouteParameter.Optional }
//            );

//            // OData routes
//            var builder = new ODataConventionModelBuilder();

//            builder.EntitySet<License>("License");
//            builder.EntitySet<Organization>("Organization");
//            builder.EntitySet<ResourcePool>("ResourcePool");
//            builder.EntitySet<ResourcePoolOrganization>("ResourcePoolOrganization");
//            builder.EntitySet<Sector>("Sector");
//            builder.EntitySet<User>("User");
//            builder.EntitySet<UserLicenseRating>("UserLicenseRating");
//            builder.EntitySet<UserResourcePool>("UserResourcePool");
//            builder.EntitySet<UserResourcePoolOrganization>("UserResourcePoolOrganization");
//            builder.EntitySet<UserSectorRating>("UserSectorRating");

//            var csdl2 = builder.GetEdmModel();

//            //IObjectContextAdapter context = new DataObjects.WealthEconomyEntities();
//            ////context.MetadataWorkspace.GetObjectSpaceType(EdmTypeKind.)
//            //var metadata = context.ObjectContext.MetadataWorkspace;

//            //// Conceptual part of the model has info about the shape of our entity classes
//            //var conceptualContainer = metadata.GetItems<EntityContainer>(DataSpace.CSpace).Single();

//            // Microsoft.Data.Edm.

//            // config.Routes.MapODataRoute()

//            // Microsoft.Data.Edm.Csdl.CsdlReader.TryParse()
//            //Microsoft.Data.Edm.Csdl.SerializationExtensionMethods.GetEdmxVersion()

//            // System.Data.metta
//            // System.Xml.Serialization.

//            // var csdl3 = ((DbContext)context).GetEdm();

//            // var x = metadata.get

//            // var xx = System.Data.Entity.Core.Metadata.Edm.DbModelExtensions.GetConceptualModel(context);

//            // System.Data.Entity.Infrastructure.

//            //var dbModel = new DbModel();
//            //// DbModel.

//            ///// dbModel.Compile(//)
//            //dbModel.GetConceptualModel();

//            // .MetadataWorkspace.GetEntityContainer("", DataSpace.CSpace);
//            // container.

//            //  config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());

//            // config.Routes.MapODataRoute() 

//            var xxxx = ODataEntityFrameworkModelBuilder.GetEdmModel<WealthEconomyEntities>();

//            config.Routes.MapODataRoute("odata", "odata", xxxx);

//            // config.Routes.MapODataRoute("odata", "odata",);

//            // var metadata = new EFContextProvider().Metadata();

//            ///* INITIAL VERSION

//            //// License
//            //builder.EntitySet<License>("License");
//            //builder.EntitySet<Organization>("Organization");
//            //builder.EntitySet<UserLicenseRating>("UserLicenseRating");

//            //// Organization
//            ////builder.EntitySet<Organization>("Organization");
//            ////builder.EntitySet<Sector>("SectorSet");
//            ////builder.EntitySet<License>("LicenseSet");
//            //builder.EntitySet<ResourcePoolOrganization>("ResourcePoolOrganization");

//            //// ResourcePool
//            //builder.EntitySet<ResourcePool>("ResourcePool");
//            ////builder.EntitySet<ResourcePoolOrganization>("ResourcePoolOrganization");
//            //builder.EntitySet<UserResourcePool>("UserResourcePool");

//            //// ResourcePoolOrganization
//            ////builder.EntitySet<ResourcePoolOrganization>("ResourcePoolOrganization");
//            ////builder.EntitySet<Organization>("OrganizationSet");
//            ////builder.EntitySet<ResourcePool>("ResourcePoolSet");
//            //builder.EntitySet<UserResourcePoolOrganization>("UserResourcePoolOrganization");

//            //// Sector
//            //builder.EntitySet<Sector>("Sector");
//            ////builder.EntitySet<Organization>("Organization");
//            //builder.EntitySet<UserSectorRating>("UserSectorRating");

//            //// User
//            //builder.EntitySet<User>("User");
//            ////builder.EntitySet<UserResourcePool>("UserResourcePool");
//            ////builder.EntitySet<UserLicenseRating>("UserLicenseRating");
//            ////builder.EntitySet<UserSectorRating>("UserSectorRating");
//            ////builder.EntitySet<UserResourcePoolOrganization>("UserResourcePoolOrganization"); 

//            //// UserLicenseRating
//            ////builder.EntitySet<UserLicenseRating>("UserLicenseRating");
//            ////builder.EntitySet<License>("LicenseSet");
//            ////builder.EntitySet<User>("UserSet");

//            //// UserResourcePool
//            ////builder.EntitySet<UserResourcePool>("UserResourcePool");
//            ////builder.EntitySet<User>("UserSet");
//            ////builder.EntitySet<ResourcePool>("ResourcePoolSet"); 

//            //// UserResourcePoolOrganization
//            ////builder.EntitySet<UserResourcePoolOrganization>("UserResourcePoolOrganization");
//            ////builder.EntitySet<User>("UserSet");
//            ////builder.EntitySet<ResourcePoolOrganization>("ResourcePoolOrganizationSet");

//            //// UserSectorRating
//            ////builder.EntitySet<UserSectorRating>("UserSectorRating");
//            ////builder.EntitySet<Sector>("SectorSet");
//            ////builder.EntitySet<User>("UserSet");
            
//            //*/
//        }
//    }
//}
