namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(UserOrganizationMetadata))]
    public partial class UserOrganization : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OrganizationId { get; set; }
        public int NumberOfSales { get; set; }
        public decimal QualityRating { get; set; }
        public decimal CustomerSatisfactionRating { get; set; }
        public decimal EmployeeSatisfactionRating { get; set; }
        
        
        

        public virtual Organization Organization { get; set; }
        public virtual User User { get; set; }

        /* */

        public UserResourcePool UserResourcePool
        {
            get { return User.UserResourcePoolSet.Single(item => item.ResourcePool == Organization.Sector.ResourcePool); }
        }

        public decimal ResourcePoolTax
        {
            get
            {
                return Organization.SalesPrice * UserResourcePool.ResourcePoolRatePercentage;
            }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return Organization.SalesPrice + ResourcePoolTax; }
        }

        public decimal TotalProductionCost
        {
            get
            {
                return Organization.ProductionCost * NumberOfSales;
            }
        }

        public decimal TotalSalesRevenue
        {
            get
            {
                return Organization.SalesPrice * NumberOfSales;
            }
        }

        public decimal TotalProfit
        {
            get
            {
                return Organization.Profit * NumberOfSales;
            }
        }

        public decimal TotalResourcePoolTax
        {
            get
            {
                return ResourcePoolTax * NumberOfSales;
            }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get
            {
                return SalesPriceIncludingResourcePoolTax * NumberOfSales;
            }
        }

        #region - Total Cost Index -

        /// <summary>
        /// Old formula for Total Cost Index calculation, based on Sales Price
        /// Keep it for a while as a sample (maybe both Profit and Sales Price could be used)
        /// </summary>
        public decimal TotalCostIndexPercentageWithSalesPrice
        {
            get
            {
                if (UserResourcePool.ResourcePool.SalesPrice == 0)
                    return 0;

                return 1 - (Organization.SalesPrice / UserResourcePool.ResourcePool.SalesPrice);
            }
        }

        public decimal TotalCostIndexPercentage
        {
            get
            {
                if (UserResourcePool.ResourcePool.Profit == 0)
                    return 0;

                return 1 - (Organization.Profit / UserResourcePool.ResourcePool.Profit);
            }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get
            {
                return TotalCostIndexPercentage * NumberOfSales;
            }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.TotalCostIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return TotalCostIndexPercentageWithNumberOfSales / UserResourcePool.TotalCostIndexPercentageWithNumberOfSales;
            }
        }

        public decimal TotalCostIndexIncome
        {
            get
            {
                return UserResourcePool.TotalCostIndexShare * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexPercentage
        {
            get
            {
                if (UserResourcePool.LicenseUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.License.GetAverageRating()
                    : Organization.License.GetAverageRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.LicenseUserRating;
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get
            {
                return KnowledgeIndexPercentage * NumberOfSales;
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return KnowledgeIndexPercentageWithNumberOfSales / UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales;
            }
        }

        public decimal KnowledgeIndexIncome
        {
            get
            {
                return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Quality Index -

        //public decimal GetAverageQualityUserRating()
        //{
        //    return GetAverageQualityUserRating(0);
        //}

        //public decimal GetAverageQualityUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserResourcePool.UserOrganizationSet.Where(rating => rating.UserId == userId)
        //        : UserResourcePool.UserOrganizationSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.QualityRating);
        //}

        public decimal QualityIndexPercentage
        {
            get
            {
                if (UserResourcePool.QualityUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.GetAverageQualityRating()
                    : Organization.GetAverageQualityRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.QualityUserRating;
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get
            {
                return QualityIndexPercentage * NumberOfSales;
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.QualityIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return QualityIndexPercentageWithNumberOfSales / UserResourcePool.QualityIndexPercentageWithNumberOfSales;
            }
        }

        public decimal QualityIndexIncome
        {
            get
            {
                return UserResourcePool.QualityIndexShare * QualityIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexPercentage
        {
            get
            {
                if (UserResourcePool.SectorUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.Sector.GetAverageRating()
                    : Organization.Sector.GetAverageRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.SectorUserRating;
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get
            {
                return SectorIndexPercentage * NumberOfSales;
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.SectorIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return SectorIndexPercentageWithNumberOfSales / UserResourcePool.SectorIndexPercentageWithNumberOfSales;
            }
        }

        public decimal SectorIndexIncome
        {
            get
            {
                return UserResourcePool.SectorIndexShare * SectorIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        //public decimal GetAverageEmployeeSatisfactionUserRating()
        //{
        //    return GetAverageEmployeeSatisfactionUserRating(0);
        //}

        //public decimal GetAverageEmployeeSatisfactionUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserResourcePool.UserOrganizationSet.Where(rating => rating.UserId == userId)
        //        : UserResourcePool.UserOrganizationSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.EmployeeSatisfactionRating);
        //}

        public decimal EmployeeSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (UserResourcePool == null)
                    return 0;

                if (UserResourcePool.EmployeeSatisfactionUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.GetAverageEmployeeSatisfactionRating()
                    : Organization.GetAverageEmployeeSatisfactionRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.EmployeeSatisfactionUserRating;
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return EmployeeSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return EmployeeSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        //public decimal GetAverageCustomerSatisfactionUserRating()
        //{
        //    return GetAverageCustomerSatisfactionUserRating(0);
        //}

        //public decimal GetAverageCustomerSatisfactionUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserResourcePool.UserOrganizationSet.Where(rating => rating.UserId == userId)
        //        : UserResourcePool.UserOrganizationSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.CustomerSatisfactionRating);
        //}

        public decimal CustomerSatisfactionIndexPercentage
        {
            get
            {
                if (UserResourcePool.CustomerSatisfactionUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.GetAverageCustomerSatisfactionRating()
                    : Organization.GetAverageCustomerSatisfactionRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.CustomerSatisfactionUserRating;
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return CustomerSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return CustomerSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Distance Index -

        /// <summary>
        /// TODO Distance Index has no calculation at the moment
        /// </summary>
        public decimal DistanceRating
        {
            get { return 1; }
        }

        public decimal DistanceIndexPercentage
        {
            get
            {
                // TODO ?
                if (UserResourcePool == null)
                    return 0;

                if (UserResourcePool.DistanceRating == 0)
                    return 0;

                return DistanceRating / UserResourcePool.DistanceRating;
            }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get
            {
                return DistanceIndexPercentage * NumberOfSales;
            }
        }

        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.DistanceIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return DistanceIndexPercentageWithNumberOfSales / UserResourcePool.DistanceIndexPercentageWithNumberOfSales;
            }
        }

        public decimal DistanceIndexIncome
        {
            get
            {
                return UserResourcePool.DistanceIndexShare * DistanceIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get
            {
                return TotalCostIndexIncome
                    + KnowledgeIndexIncome
                    + QualityIndexIncome
                    + SectorIndexIncome
                    + EmployeeSatisfactionIndexIncome
                    + CustomerSatisfactionIndexIncome
                    + DistanceIndexIncome;
            }
        }

        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }

    }
}
