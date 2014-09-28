namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public class UserResourcePoolIndexElementItemElementField
    {
        // public UserResourcePoolIndexElementItemElementField(UserOrganization userOrganization, ResourcePoolIndexOrganization resourcePoolIndexOrganization)
        public UserResourcePoolIndexElementItemElementField(User user, ResourcePoolIndexElementItemElementField resourcePoolIndexElementItemElementField)
        {
            User = user;
            //UserOrganization = userOrganization;
            ResourcePoolIndexElementItemElementField = ResourcePoolIndexElementItemElementField;
        }

        internal User User { get; private set; }
        // internal UserOrganization UserOrganization { get; private set; }
        internal ResourcePoolIndexElementItemElementField ResourcePoolIndexElementItemElementField { get; private set; }

        internal UserResourcePoolIndex UserResourcePoolIndex
        {
            // get { return ResourcePoolIndexElementItemElementField.ResourcePoolIndex.UserResourcePoolIndexSet.SingleOrDefault(item => item.UserResourcePool.User == UserOrganization.User); }
            get { return ResourcePoolIndexElementItemElementField.ResourcePoolIndex.UserResourcePoolIndexSet.SingleOrDefault(item => item.UserResourcePool.User == User); }
        }

        public decimal IndexValueMultiplied
        {
            // TODO
            // get { return ResourcePoolIndexElementItemElementField.IndexValue * UserOrganization.NumberOfSalesPercentage; }
            get { return ResourcePoolIndexElementItemElementField.IndexValue * 1; }
        }

        public decimal IndexValuePercentage
        {
            get
            {
                return UserResourcePoolIndex.IndexOrganizationValueMultiplied == 0
                    ? 0
                    : IndexValueMultiplied / UserResourcePoolIndex.IndexOrganizationValueMultiplied;
            }
        }

        public decimal IndexIncome
        {
            get
            {
                // TODO Is it possible to ensure that there is UserResourcePoolIndex?
                if (UserResourcePoolIndex == null)
                    return 0;

                return UserResourcePoolIndex.IndexShare * IndexValuePercentage;
            }
        }
    }
}
