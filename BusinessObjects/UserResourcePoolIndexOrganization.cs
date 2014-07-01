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

        //public decimal IndexValuePercentageWithNumberOfSales
        //{
        //    get
        //    {
        //        return ResourcePoolIndexOrganization.IndexValuePercentage * UserOrganization.NumberOfSales;
        //    }
        //}

        //public decimal IndexValuePercentageWithNumberOfSalesPercentage
        //{
        //    get
        //    {
        //        return UserResourcePoolIndex.IndexValuePercentageWithNumberOfSales == 0
        //            ? 0
        //            : IndexValuePercentageWithNumberOfSales / UserResourcePoolIndex.IndexValuePercentageWithNumberOfSales;
        //    }
        //}

        public decimal IndexValueMultiplied
        {
            get
            {
                switch (UserResourcePoolIndex.ResourcePoolIndex.ResourcePoolIndexType)
                {
                    case (byte)ResourcePoolIndexType.SectorIndex:
                        return UserOrganization.Organization.Sector.RatingPercentage * UserOrganization.NumberOfSalesPercentage;
                    case (byte)ResourcePoolIndexType.KnowledgeIndex:
                        return UserOrganization.Organization.License.RatingPercentage * UserOrganization.NumberOfSalesPercentage;
                    case (byte)ResourcePoolIndexType.TotalCostIndex:
                        return UserOrganization.Organization.SalesPricePercentage * UserOrganization.NumberOfSalesPercentage;
                    case (byte)ResourcePoolIndexType.DynamicIndex:
                        return ResourcePoolIndexOrganization.IndexValuePercentage * UserOrganization.NumberOfSalesPercentage;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
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

                //return UserResourcePoolIndex.IndexShare * IndexValuePercentageWithNumberOfSalesPercentage;
                return UserResourcePoolIndex.IndexShare * IndexValuePercentage;
            }
        }
    }
}
