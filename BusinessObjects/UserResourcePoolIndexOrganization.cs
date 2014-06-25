namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public class UserResourcePoolIndexOrganization
    {
        public UserResourcePoolIndexOrganization(UserOrganization userOrganization, ResourcePoolIndexOrganization resourcePoolIndexOrganization)
        {
            UserOrganization = userOrganization;
            ResourcePoolIndexOrganization = resourcePoolIndexOrganization;
        }

        internal UserOrganization UserOrganization { get; private set; }
        internal ResourcePoolIndexOrganization ResourcePoolIndexOrganization { get; private set; }

        internal UserResourcePoolIndex UserResourcePoolIndex
        {
            get { return ResourcePoolIndexOrganization.ResourcePoolIndex.UserResourcePoolIndexSet.SingleOrDefault(item => item.UserResourcePool.User == UserOrganization.User); }
        }

        public decimal IndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return ResourcePoolIndexOrganization.IndexValueWeightedAverage * UserOrganization.NumberOfSales;
            }
        }

        public decimal IndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePoolIndex.IndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : IndexValueWeightedAverageWithNumberOfSales / UserResourcePoolIndex.IndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal IndexIncome
        {
            get
            {
                return UserResourcePoolIndex.IndexShare * IndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }
    }
}
