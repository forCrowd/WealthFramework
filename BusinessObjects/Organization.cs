namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Organization : BaseEntity
    {
        public Organization()
        {
            UserOrganizationSet = new HashSet<UserOrganization>();
            UserResourcePoolIndexValueSet = new HashSet<UserResourcePoolIndexValue>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public short SectorId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Organization")]
        public string Name { get; set; }

        [Display(Name = "Production Cost")]
        public decimal ProductionCost { get; set; }

        [Display(Name = "Sales Price")]
        public decimal SalesPrice { get; set; }

        public short LicenseId { get; set; }
        
        public virtual Sector Sector { get; set; }
        public virtual License License { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }
        public virtual ICollection<UserResourcePoolIndexValue> UserResourcePoolIndexValueSet { get; set; }

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
        public decimal ProfitPercentage
        {
            get
            {
                return ProductionCost == 0
                    ? 0
                    : Profit / ProductionCost;
            }
        }

        public decimal ProfitMargin
        {
            get
            {
                return SalesPrice == 0
                    ? 0
                    : Profit / SalesPrice;
            }
        }
    }
}
