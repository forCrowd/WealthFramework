namespace BusinessObjects
{
    using BusinessObjects.Metadata;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [MetadataType(typeof(UserResourcePoolMetadata))]
    public partial class UserResourcePool : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ResourcePoolId { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal TotalCostIndexRating { get; set; }
        public decimal KnowledgeIndexRating { get; set; }
        public decimal QualityIndexRating { get; set; }
        public decimal SectorIndexRating { get; set; }
        public decimal EmployeeSatisfactionIndexRating { get; set; }
        public decimal CustomerSatisfactionIndexRating { get; set; }
        public decimal DistanceIndexRating { get; set; }

        public virtual User User { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }

        #region - General -

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        }

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserOrganization (UserResourcePoolId on UserOrganization).
        public IEnumerable<UserOrganization> UserOrganizationSet
        {
            get
            {
                return User
                    .UserOrganizationSet
                    .Where(item => item.Organization.Sector.ResourcePool == ResourcePool);
            }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
            private set { }
        }

        public decimal ResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.ResourcePoolTax); }
            private set { }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
            private set { }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.NumberOfSales); }
            private set { }
        }

        public decimal TotalProductionCost
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProductionCost); }
            private set { }
        }

        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenue); }
            private set { }
        }

        public decimal TotalProfit
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProfit); }
            private set { }
        }

        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
            private set { }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
            private set { }
        }

        public decimal TotalResourcePoolIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
            private set { }
        }

        public decimal TotalIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalIncome); }
            private set { }
        }

        #endregion

        #region - Total Cost Index -

        public decimal TotalCostIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return TotalCostIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * TotalCostIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal TotalCostIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
            private set { }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return KnowledgeIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * KnowledgeIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
            private set { }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return QualityIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * QualityIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal QualityIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexIncome); }
            private set { }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return SectorIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * SectorIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal SectorIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexIncome); }
            private set { }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return EmployeeSatisfactionIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * EmployeeSatisfactionIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
            private set { }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return CustomerSatisfactionIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * CustomerSatisfactionIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
            private set { }
        }

        #endregion

        #region - Distance Index -

        public decimal DistanceIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return DistanceIndexRating / ResourcePool.TotalIndexRating;
            }
            private set { }
        }

        public decimal DistanceIndexShare
        {
            get { return TotalResourcePoolTax * DistanceIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal DistanceRating
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceRating); }
            private set { }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexIncome); }
            private set { }
        }

        #endregion
    }
}
