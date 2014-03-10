namespace BusinessObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class ResourcePoolOrganization
    {
        public string Name { get { return string.Format("{0} - {1}", ResourcePool.Name, Organization.Name); } }
    }
}
