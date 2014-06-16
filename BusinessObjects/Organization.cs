namespace BusinessObjects
{
    using BusinessObjects.Metadata;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [MetadataType(typeof(OrganizationMetadata))]
    public partial class Organization : BaseEntity
    {
        public Organization()
        {
            this.UserOrganizationSet = new HashSet<UserOrganization>();
        }

        public int Id { get; set; }
        public short SectorId { get; set; }
        public string Name { get; set; }
        public decimal ProductionCost { get; set; }
        public decimal SalesPrice { get; set; }
        public short LicenseId { get; set; }
        
        public virtual Sector Sector { get; set; }
        public virtual License License { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }

        /* */

        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        public decimal GetAverageQualityRating()
        {
            return UserOrganizationSet.Any()
                ? UserOrganizationSet.Average(item => item.QualityRating)
                : 0;
        }

        public decimal GetAverageEmployeeSatisfactionRating()
        {
            return UserOrganizationSet.Any()
                ? UserOrganizationSet.Average(rating => rating.EmployeeSatisfactionRating)
                : 0;
        }

        public decimal GetAverageCustomerSatisfactionRating()
        {
            return UserOrganizationSet.Any()
                ? UserOrganizationSet.Average(rating => rating.CustomerSatisfactionRating)
                : 0;   
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
    }
}
