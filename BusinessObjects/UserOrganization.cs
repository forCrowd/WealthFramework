namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("User Organization")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    public class UserOrganization : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdOrganizationId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdOrganizationId", 2, IsUnique = true)]
        public int OrganizationId { get; set; }

        [Display(Name = "Number of Sales")]
        public int NumberOfSales { get; set; }

        public virtual User User { get; set; }

        public virtual Organization Organization { get; set; }

        /* */

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserResourcePool (UserResourcePoolId on this class).
        public UserResourcePool UserResourcePool
        {
            get { return User.UserResourcePoolSet.Single(item => item.ResourcePool == Organization.ResourcePool); }
        }

        public IEnumerable<UserResourcePoolIndexOrganization> UserResourcePoolIndexOrganizationSet
        {
            get
            {
                var list = new HashSet<UserResourcePoolIndexOrganization>();

                foreach (var item in UserResourcePool.ResourcePool.ResourcePoolIndexSet)
                    list.Add(new UserResourcePoolIndexOrganization(this, new ResourcePoolIndexOrganization(item, Organization)));

                return list;
            }
        }

        public decimal NumberOfSalesPercentage
        {
            get
            {
                return UserResourcePool.NumberOfSales == 0
                    ? 0
                    : decimal.Divide(NumberOfSales, UserResourcePool.NumberOfSales); // To be able to get decimal ouput from integer / integer
            }
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
            get { return Organization.ProductionCost * NumberOfSales; }
        }

        public decimal TotalSalesRevenue
        {
            get { return Organization.SalesPrice * NumberOfSales; }
        }

        public decimal TotalProfit
        {
            get { return Organization.Profit * NumberOfSales; }
        }

        public decimal TotalResourcePoolTax
        {
            get { return ResourcePoolTax * NumberOfSales; }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return SalesPriceIncludingResourcePoolTax * NumberOfSales; }
        }

        /// <summary>
        /// Dynamic index income
        /// </summary>
        public decimal IndexIncome
        {
            get { return UserResourcePoolIndexOrganizationSet.Sum(item => item.IndexIncome); }
        }

        public decimal TotalIncome
        {
            get { return TotalProfit + IndexIncome; }
        }

    }
}
