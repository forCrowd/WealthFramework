namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Organization
    {
        // TODO ?
        internal ResourcePool ResourcePool { get; set; }

        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        /// <summary>
        /// a.k.a Markup percentage
        /// </summary>
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage
        {
            get
            {
                if (Profit == 0)
                    return 0;
                return Profit / ProductionCost;
            }
        }

        [Display(Name = "Profit Margin")]
        public decimal ProfitMargin
        {
            get
            {
                if (Profit == 0)
                    return 0;
                return Profit / SalesPrice;
            }
        }

        [Display(Name = "CMRP Tax")]
        public decimal ResourcePoolTax
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;

                // TODO ?
                if (ResourcePool == null)
                    return 0;

                return SalesPrice * ResourcePool.ResourcePoolRate;
            }
        }

        [Display(Name = "Sales Price incl. CMRP Tax")]
        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return SalesPrice + ResourcePoolTax; }
        }

        #region - Total Cost Index -

        [Display(Name = "Total Cost Index Percentage")]
        public decimal TotalCostIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.SalesPrice == 0)
                    return 0;

                return 1 - (SalesPrice / ResourcePool.SalesPrice);
            }
        }

        #endregion

        #region - Knowledge Index -

        [Display(Name = "Knowledge Index Percentage")]
        public decimal KnowledgeIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.LicenseUserRating == 0)
                    return 0;

                var rating = ResourcePool.ResourcePoolType == ResourcePoolType.Public
                    ? License.GetAverageUserRating()
                    : License.GetAverageUserRating(ResourcePool.User.Id);

                return rating / ResourcePool.LicenseUserRating;
            }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityUserRating
        {
            get
            {
                if (UserOrganizationRatingSet.Count == 0)
                    return 0;

                return UserOrganizationRatingSet.Average(rating => rating.QualityRating);
            }
        }

        public decimal GetAverageQualityUserRating()
        {
            return GetAverageQualityUserRating(0);
        }

        public decimal GetAverageQualityUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
                : UserOrganizationRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.QualityRating);
        }

        [Display(Name = "Quality Index Percentage")]
        public decimal QualityIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.QualityUserRating == 0)
                    return 0;

                var rating = ResourcePool.ResourcePoolType == ResourcePoolType.Public
                    ? GetAverageQualityUserRating()
                    : GetAverageQualityUserRating(ResourcePool.User.Id);

                return rating / ResourcePool.QualityUserRating;
            }
        }

        #endregion

        #region - Sector Index -

        [Display(Name = "Sector Index Percentage")]
        public decimal SectorIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.SectorUserRating == 0)
                    return 0;

                var rating = ResourcePool.ResourcePoolType == ResourcePoolType.Public
                    ? Sector.GetAverageUserRating()
                    : Sector.GetAverageUserRating(ResourcePool.User.Id);

                return rating / ResourcePool.SectorUserRating;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        public decimal GetAverageEmployeeSatisfactionUserRating()
        {
            return GetAverageEmployeeSatisfactionUserRating(0);
        }

        public decimal GetAverageEmployeeSatisfactionUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
                : UserOrganizationRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.EmployeeSatisfactionRating);
        }

        [Display(Name = "Employee Satisfaction Index Percentage")]
        public decimal EmployeeSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.EmployeeSatisfactionUserRating == 0)
                    return 0;

                var rating = ResourcePool.ResourcePoolType == ResourcePoolType.Public
                    ? GetAverageEmployeeSatisfactionUserRating()
                    : GetAverageEmployeeSatisfactionUserRating(ResourcePool.User.Id);

                return rating / ResourcePool.EmployeeSatisfactionUserRating;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        public decimal GetAverageCustomerSatisfactionUserRating()
        {
            return GetAverageCustomerSatisfactionUserRating(0);
        }

        public decimal GetAverageCustomerSatisfactionUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
                : UserOrganizationRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.CustomerSatisfactionRating);
        }

        [Display(Name = "Customer Satisfaction Index Percentage")]
        public decimal CustomerSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.CustomerSatisfactionUserRating == 0)
                    return 0;

                var rating = ResourcePool.ResourcePoolType == ResourcePoolType.Public
                    ? GetAverageCustomerSatisfactionUserRating()
                    : GetAverageCustomerSatisfactionUserRating(ResourcePool.User.Id);

                return rating / ResourcePool.CustomerSatisfactionUserRating;
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

        [Display(Name = "Distance Index Percentage")]
        public decimal DistanceIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;

                if (ResourcePool.DistanceRating == 0)
                    return 0;

                return DistanceRating / ResourcePool.DistanceRating;
            }
        }

        #endregion
    }
}
