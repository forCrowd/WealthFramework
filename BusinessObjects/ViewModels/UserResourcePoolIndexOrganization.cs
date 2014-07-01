using System;
namespace BusinessObjects.ViewModels
{
    public class UserResourcePoolIndexOrganization
    {
        public UserResourcePoolIndexOrganization() { }

        public UserResourcePoolIndexOrganization(BusinessObjects.UserResourcePoolIndexOrganization userResourcePoolIndexOrganization)
        {
            if (userResourcePoolIndexOrganization == null)
                throw new ArgumentNullException("userResourcePoolIndexOrganization");

            UserId = userResourcePoolIndexOrganization.UserResourcePoolIndex.UserResourcePool.UserId;
            UserEmail = userResourcePoolIndexOrganization.UserResourcePoolIndex.UserResourcePool.User.Email;
            ResourcePoolId = userResourcePoolIndexOrganization.UserResourcePoolIndex.UserResourcePool.ResourcePoolId;
            ResourcePoolName = userResourcePoolIndexOrganization.UserResourcePoolIndex.UserResourcePool.ResourcePool.Name;
            ResourcePoolIndexId = userResourcePoolIndexOrganization.UserResourcePoolIndex.ResourcePoolIndexId;
            ResourcePoolIndexName = userResourcePoolIndexOrganization.UserResourcePoolIndex.ResourcePoolIndex.Name;
            OrganizationId = userResourcePoolIndexOrganization.UserOrganization.OrganizationId;
            OrganizationName = userResourcePoolIndexOrganization.UserOrganization.Organization.Name;
            UserResourcePoolId = userResourcePoolIndexOrganization.UserResourcePoolIndex.UserResourcePoolId;
            UserResourcePoolIndexId = userResourcePoolIndexOrganization.UserResourcePoolIndex.Id;
            ResourcePoolIndexOrganizationIndexValuePercentage = userResourcePoolIndexOrganization.ResourcePoolIndexOrganization.IndexValuePercentage;
            //IndexValuePercentageWithNumberOfSales = userResourcePoolIndexOrganization.IndexValuePercentageWithNumberOfSales;
            //IndexValuePercentageWithNumberOfSalesPercentage = userResourcePoolIndexOrganization.IndexValuePercentageWithNumberOfSalesPercentage;
            IndexValueMultiplied = userResourcePoolIndexOrganization.IndexValueMultiplied;
            IndexValuePercentage = userResourcePoolIndexOrganization.IndexValuePercentage;
            IndexIncome = userResourcePoolIndexOrganization.IndexIncome;
        }

        public int UserId { get; set; }
        public string UserEmail { get; set; }
        public int ResourcePoolId { get; set; }
        public string ResourcePoolName { get; set; }
        public int ResourcePoolIndexId { get; set; }
        public string ResourcePoolIndexName { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public int UserResourcePoolId { get; set; }
        public int UserResourcePoolIndexId { get; set; }

        public decimal ResourcePoolIndexOrganizationIndexValuePercentage { get; set; }
        //public decimal IndexValuePercentageWithNumberOfSales { get; set; }
        //public decimal IndexValuePercentageWithNumberOfSalesPercentage { get; set; }
        public decimal IndexValueMultiplied { get; set; }
        public decimal IndexValuePercentage { get; set; }
        public decimal IndexIncome { get; set;}
    }
}
