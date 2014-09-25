namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
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

        public decimal IndexValue
        {
            get
            {
                switch (UserResourcePoolIndex.ResourcePoolIndex.ResourcePoolIndexType)
                {
                    case (byte)ResourcePoolIndexType.TotalCostIndex:
                        return UserOrganization.Organization.SalesPricePercentage;
                    case (byte)ResourcePoolIndexType.DynamicOrganizationIndex:
                        return ResourcePoolIndexOrganization.DynamicOrganizationIndexValuePercentage;
                    case (byte)ResourcePoolIndexType.DynamicElementIndex:
                        return ResourcePoolIndexOrganization.OrganizationElementItem.RatingPercentage;
                    case (byte)ResourcePoolIndexType.DynamicElementFieldIndex:
                        return ResourcePoolIndexOrganization.OrganizationElementItemElementField.RatingPercentage;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }        
        }

        public decimal IndexValueMultiplied
        {
            get { return IndexValue * UserOrganization.NumberOfSalesPercentage; }
        }

        public decimal IndexValuePercentage
        {
            get
            {
                return UserResourcePoolIndex.IndexValueMultiplied == 0
                    ? 0
                    : IndexValueMultiplied / UserResourcePoolIndex.IndexValueMultiplied;
            }
        }

        public decimal IndexIncome
        {
            get
            {
                // TODO Is it possible to ensure that there is UserResourcePoolIndex?
                if (UserResourcePoolIndex == null)
                    return 0;

                return UserResourcePoolIndex.IndexShare * IndexValuePercentage;
            }
        }
    }
}
