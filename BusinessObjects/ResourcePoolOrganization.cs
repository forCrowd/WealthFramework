namespace BusinessObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class ResourcePoolOrganization
    {
        public string Name
        {
            get
            {
                // To be able to compatible with OData service. Try to improve
                if (ResourcePool == null)
                    return string.Empty;

                if (Organization == null)
                    return string.Empty;

                return string.Format("{0} - {1}", ResourcePool.Name, Organization.Name);
            }
            private set { }
        }
    }
}
