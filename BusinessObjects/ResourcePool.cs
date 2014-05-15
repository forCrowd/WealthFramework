namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(ResourcePoolMetadata))]
    public partial class ResourcePool : BaseEntity
    {
        public ResourcePool()
        {
            this.LicenseSet = new HashSet<License>();
            this.OrganizationSet = new HashSet<Organization>();
            this.SectorSet = new HashSet<Sector>();
            this.UserResourcePoolSet = new HashSet<UserResourcePool>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<License> LicenseSet { get; set; }
        public virtual ICollection<Sector> SectorSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        /* */

        public IEnumerable<Organization> OrganizationSet
        {
            get { return SectorSet.SelectMany(sector => sector.OrganizationSet); }
            private set { }
        }

        public decimal ProductionCost
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.ProductionCost);
            }
            private set { }
        }

        public decimal SalesPrice
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.SalesPrice);
            }
            private set { }
        }

        public decimal Profit
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Sum(organization => organization.Profit);
            }
            private set { }
        }

        public decimal ProfitPercentage
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Average(organization => organization.ProfitPercentage);
            }
            private set { }
        }

        public decimal ProfitMargin
        {
            get
            {
                if (!OrganizationSet.Any())
                    return 0;
                return OrganizationSet.Average(organization => organization.ProfitMargin);
            }
            private set { }
        }

        //public decimal ResourcePoolTax
        //{
        //    get { return OrganizationSet.Sum(organization => organization.ResourcePoolTax); }
        //}

        //public decimal SalesPriceIncludingResourcePoolTax
        //{
        //    get { return OrganizationSet.Sum(organization => organization.SalesPriceIncludingResourcePoolTax); }
        //}

    }
}
