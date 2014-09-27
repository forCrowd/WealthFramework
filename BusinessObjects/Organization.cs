namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Organization : BaseEntity
    {
        public Organization()
        {
            OrganizationElementItemSet = new HashSet<OrganizationElementItem>();
            UserOrganizationSet = new HashSet<UserOrganization>();
            UserResourcePoolIndexValueSet = new HashSet<UserResourcePoolIndexValue>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Organization")]
        public string Name { get; set; }

        [Display(Name = "Production Cost")]
        public decimal ProductionCost { get; set; }

        [Display(Name = "Sales Price")]
        public decimal SalesPrice { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual ICollection<OrganizationElementItem> OrganizationElementItemSet { get; set; }
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

        ///// <summary>
        ///// Will be used in Total Cost Index calculation
        ///// </summary>
        //public decimal SalesPricePercentage
        //{
        //    get
        //    {
        //        return ResourcePool.TotalCostIndex == null
        //            ? 0
        //            : ResourcePool.TotalCostIndex.IndexValue == 0
        //            ? 0
        //            : SalesPrice / ResourcePool.TotalCostIndex.IndexValue;
        //    }
        //}
    }
}
