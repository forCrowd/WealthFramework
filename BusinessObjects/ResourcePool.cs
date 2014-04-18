namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class ResourcePool
    {
        public decimal ProductionCost
        {
            get
            {
                if (ResourcePoolOrganizationSet.Count == 0)
                    return 0;
                return ResourcePoolOrganizationSet.Sum(item => item.Organization.ProductionCost);
            }
            private set { }
        }

        public decimal SalesPrice
        {
            get
            {
                if (ResourcePoolOrganizationSet.Count == 0)
                    return 0;
                return ResourcePoolOrganizationSet.Sum(item => item.Organization.SalesPrice);
            }
            private set { }
        }

        public decimal Profit
        {
            get
            {
                if (ResourcePoolOrganizationSet.Count == 0)
                    return 0;
                return ResourcePoolOrganizationSet.Sum(item => item.Organization.Profit);
            }
            private set { }
        }

        public decimal ProfitPercentage
        {
            get
            {
                if (ResourcePoolOrganizationSet.Count == 0)
                    return 0;
                return ResourcePoolOrganizationSet.Average(item => item.Organization.ProfitPercentage);
            }
            private set { }
        }

        public decimal ProfitMargin
        {
            get
            {
                if (ResourcePoolOrganizationSet.Count == 0)
                    return 0;
                return ResourcePoolOrganizationSet.Average(item => item.Organization.ProfitMargin);
            }
            private set { }
        }

        //public decimal ResourcePoolTax
        //{
        //    get { return ResourcePoolOrganizationSet.Sum(item => item.Organization.ResourcePoolTax); }
        //}

        //public decimal SalesPriceIncludingResourcePoolTax
        //{
        //    get { return ResourcePoolOrganizationSet.Sum(item => item.Organization.SalesPriceIncludingResourcePoolTax); }
        //}
    }
}
