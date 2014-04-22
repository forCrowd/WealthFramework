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
                if (OrganizationSet.Count == 0)
                    return 0;
                return OrganizationSet.Sum(organization => organization.ProductionCost);
            }
            private set { }
        }

        public decimal SalesPrice
        {
            get
            {
                if (OrganizationSet.Count == 0)
                    return 0;
                return OrganizationSet.Sum(organization => organization.SalesPrice);
            }
            private set { }
        }

        public decimal Profit
        {
            get
            {
                if (OrganizationSet.Count == 0)
                    return 0;
                return OrganizationSet.Sum(organization => organization.Profit);
            }
            private set { }
        }

        public decimal ProfitPercentage
        {
            get
            {
                if (OrganizationSet.Count == 0)
                    return 0;
                return OrganizationSet.Average(organization => organization.ProfitPercentage);
            }
            private set { }
        }

        public decimal ProfitMargin
        {
            get
            {
                if (OrganizationSet.Count == 0)
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
