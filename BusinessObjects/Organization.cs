namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class Organization
    {
        // TODO ?
        // internal OrganizationGroup OrganizationGroup { get; set; }
        public UserResourcePool UserResourcePool { get; set; }

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
                if (ProductionCost == 0)
                    return 0;

                return Profit / ProductionCost;
            }
        }

        [Display(Name = "Profit Margin")]
        public decimal ProfitMargin
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;

                return Profit / SalesPrice;
            }
        }

        /* from here, it should be moved to a higher place */

        //[Display(Name = "CMRP Tax")]
        //public decimal ResourcePoolTax
        //{
        //    get
        //    {
        //        if (SalesPrice == 0)
        //            return 0;

        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        return SalesPrice * UserResourcePool.ResourcePoolRate;
        //    }
        //}

        //[Display(Name = "Sales Price incl. CMRP Tax")]
        //public decimal SalesPriceIncludingResourcePoolTax
        //{
        //    get { return SalesPrice + ResourcePoolTax; }
        //}

        #region - Total Cost Index -

        //[Display(Name = "Total Cost Index Percentage")]
        //public decimal TotalCostIndexPercentage
        //{
        //    get
        //    {
        //        if (UserResourcePool.ResourcePool.SalesPrice == 0)
        //            return 0;

        //        return 1 - (SalesPrice / UserResourcePool.ResourcePool.SalesPrice);
        //    }
        //}

        #endregion

        #region - Knowledge Index -

        //[Display(Name = "Knowledge Index Percentage")]
        //public decimal KnowledgeIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.LicenseUserRating == 0)
        //            return 0;

        //        var rating = UserResourcePool.OrganizationGroupType == OrganizationGroupType.Public
        //            ? License.GetAverageUserRating()
        //            : License.GetAverageUserRating(UserResourcePool.User.Id);

        //        return rating / UserResourcePool.LicenseUserRating;
        //    }
        //}

        #endregion

        #region - Quality Index -

        //public decimal GetAverageQualityUserRating()
        //{
        //    return GetAverageQualityUserRating(0);
        //}

        //public decimal GetAverageQualityUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
        //        : UserOrganizationRatingSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.QualityRating);
        //}

        //[Display(Name = "Quality Index Percentage")]
        //public decimal QualityIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.QualityUserRating == 0)
        //            return 0;

        //        var rating = UserResourcePool.OrganizationGroupType == OrganizationGroupType.Public
        //            ? GetAverageQualityUserRating()
        //            : GetAverageQualityUserRating(UserResourcePool.User.Id);

        //        return rating / UserResourcePool.QualityUserRating;
        //    }
        //}

        #endregion

        #region - Sector Index -

        //[Display(Name = "Sector Index Percentage")]
        //public decimal SectorIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.SectorUserRating == 0)
        //            return 0;

        //        var rating = UserResourcePool.OrganizationGroupType == OrganizationGroupType.Public
        //            ? Sector.GetAverageUserRating()
        //            : Sector.GetAverageUserRating(UserResourcePool.User.Id);

        //        return rating / UserResourcePool.SectorUserRating;
        //    }
        //}

        #endregion

        #region - Employee Satisfaction Index -

        //public decimal GetAverageEmployeeSatisfactionUserRating()
        //{
        //    return GetAverageEmployeeSatisfactionUserRating(0);
        //}

        //public decimal GetAverageEmployeeSatisfactionUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
        //        : UserOrganizationRatingSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.EmployeeSatisfactionRating);
        //}

        //[Display(Name = "Employee Satisfaction Index Percentage")]
        //public decimal EmployeeSatisfactionIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.EmployeeSatisfactionUserRating == 0)
        //            return 0;

        //        var rating = UserResourcePool.OrganizationGroupType == OrganizationGroupType.Public
        //            ? GetAverageEmployeeSatisfactionUserRating()
        //            : GetAverageEmployeeSatisfactionUserRating(UserResourcePool.User.Id);

        //        return rating / UserResourcePool.EmployeeSatisfactionUserRating;
        //    }
        //}

        #endregion

        #region - Customer Satisfaction Index -

        //public decimal GetAverageCustomerSatisfactionUserRating()
        //{
        //    return GetAverageCustomerSatisfactionUserRating(0);
        //}

        //public decimal GetAverageCustomerSatisfactionUserRating(int userId)
        //{
        //    var ratings = userId > 0
        //        ? UserOrganizationRatingSet.Where(rating => rating.UserId == userId)
        //        : UserOrganizationRatingSet;

        //    if (!ratings.Any())
        //        return 0;

        //    return ratings.Average(rating => rating.CustomerSatisfactionRating);
        //}

        //[Display(Name = "Customer Satisfaction Index Percentage")]
        //public decimal CustomerSatisfactionIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.CustomerSatisfactionUserRating == 0)
        //            return 0;

        //        var rating = UserResourcePool.OrganizationGroupType == OrganizationGroupType.Public
        //            ? GetAverageCustomerSatisfactionUserRating()
        //            : GetAverageCustomerSatisfactionUserRating(UserResourcePool.User.Id);

        //        return rating / UserResourcePool.CustomerSatisfactionUserRating;
        //    }
        //}

        #endregion

        #region - Distance Index -

        ///// <summary>
        ///// TODO Distance Index has no calculation at the moment
        ///// </summary>
        //public decimal DistanceRating
        //{
        //    get { return 1; }
        //}

        //[Display(Name = "Distance Index Percentage")]
        //public decimal DistanceIndexPercentage
        //{
        //    get
        //    {
        //        // TODO ?
        //        if (UserResourcePool == null)
        //            return 0;

        //        if (UserResourcePool.DistanceRating == 0)
        //            return 0;

        //        return DistanceRating / UserResourcePool.DistanceRating;
        //    }
        //}

        #endregion
    }
}
