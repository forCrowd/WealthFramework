namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class ResourcePool
    {
        public decimal ProductionCost
        {
            get { return ResourcePoolOrganizationSet.Sum(item => item.Organization.ProductionCost); }
        }

        public decimal SalesPrice
        {
            get { return ResourcePoolOrganizationSet.Sum(item => item.Organization.SalesPrice); }
        }

        public decimal Profit
        {
            get { return ResourcePoolOrganizationSet.Sum(item => item.Organization.Profit); }
        }

        public decimal ProfitPercentage
        {
            get { return ResourcePoolOrganizationSet.Average(item => item.Organization.ProfitPercentage); }
        }

        public decimal ProfitMargin
        {
            get { return ResourcePoolOrganizationSet.Average(item => item.Organization.ProfitMargin); }
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
