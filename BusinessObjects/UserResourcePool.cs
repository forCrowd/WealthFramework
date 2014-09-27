namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("User CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserResourcePool : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdResourcePoolId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdResourcePoolId", 2, IsUnique = true)]
        public int ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; set; }

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
                    .Where(item => item.Organization.ResourcePool == ResourcePool);
            }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
        }

        public decimal ResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.ResourcePoolTax); }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.NumberOfSales); }
        }

        //public decimal TotalProductionCost
        //{
        //    get { return UserOrganizationSet.Sum(item => item.TotalProductionCost); }
        //}

        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenue); }
        }

        //public decimal TotalProfit
        //{
        //    get { return UserOrganizationSet.Sum(item => item.TotalProfit); }
        //}

        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
        }

        public decimal TotalIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalIncome); }
        }

        #endregion
    }
}
