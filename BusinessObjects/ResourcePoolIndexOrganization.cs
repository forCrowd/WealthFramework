namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class ResourcePoolIndexOrganization
    {
        public ResourcePoolIndexOrganization(ResourcePoolIndex resourcePoolIndex, Organization organization)
        {
            ResourcePoolIndex = resourcePoolIndex;
            Organization = organization;
        }

        public string ResourcePoolName { get { return ResourcePoolIndex.ResourcePool.Name; } }
        public string ResourcePoolIndexName { get { return ResourcePoolIndex.Name; } }
        public string OrganizationName { get { return Organization.Name; } }

        internal ResourcePoolIndex ResourcePoolIndex { get; private set; }
        internal Organization Organization { get; private set; }

        internal IEnumerable<UserResourcePoolIndexValue> UserValueSet
        {
            get
            {
                return Organization.UserResourcePoolIndexValueSet.Where(item => item.UserResourcePoolIndex.ResourcePoolIndex == ResourcePoolIndex);
            }
        }

        internal ElementItem OrganizationElementItem
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicElementIndex)
                    throw new InvalidOperationException("Invalid index type");

                var organizationElement = Organization.OrganizationElementItemSet.SingleOrDefault(item => item.ElementItem.Element == ResourcePoolIndex.Element);

                if (organizationElement == null)
                    return null;

                return organizationElement.ElementItem;
            }
        }

        internal ElementItemElementField OrganizationElementItemElementField
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicElementFieldIndex)
                    throw new InvalidOperationException("Invalid index type");

                var organizationElement = Organization.OrganizationElementItemSet.SingleOrDefault(item => item.ElementItem.ElementItemElementFieldSet.Any(itemField => itemField.ElementField == ResourcePoolIndex.ElementField));

                if (organizationElement == null)
                    return null;

                return organizationElement.ElementItem.ElementItemElementFieldSet.SingleOrDefault(itemField => itemField.ElementField == ResourcePoolIndex.ElementField);
            }
        }

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal DynamicOrganizationIndexValueCount
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicOrganizationIndex)
                    throw new InvalidOperationException("Invalid index type");

                return UserValueSet.Count();
            }
        }

        /// <summary>
        /// Determines the average rating of this index.
        /// It will be used to determine the weight of this index in its resource pool.
        /// </summary>
        public decimal DynamicOrganizationIndexValueAverage
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicOrganizationIndex)
                    throw new InvalidOperationException("Invalid index type");

                return UserValueSet.Any()
                    ? UserValueSet.Average(item => item.Rating)
                    : 0;
            }
        }

        /// <summary>
        /// Determines the rating percentage of this index.
        /// </summary>
        public decimal DynamicOrganizationIndexValuePercentage
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicOrganizationIndex)
                    throw new InvalidOperationException("Invalid index type");

                return ResourcePoolIndex.IndexValue == 0
                    ? 0
                    : DynamicOrganizationIndexValueAverage / ResourcePoolIndex.IndexValue;
            }
        }

        public decimal IndexValue
        {
            get
            {
                switch (ResourcePoolIndex.ResourcePoolIndexType)
                {
                    case (byte)ResourcePoolIndexType.TotalCostIndex:
                        return Organization.SalesPricePercentage;
                    case (byte)ResourcePoolIndexType.DynamicOrganizationIndex:
                        return DynamicOrganizationIndexValuePercentage;
                    case (byte)ResourcePoolIndexType.DynamicElementIndex:
                        return OrganizationElementItem.RatingPercentage;
                    case (byte)ResourcePoolIndexType.DynamicElementFieldIndex:
                        return OrganizationElementItemElementField.RatingPercentage;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        ///// <summary>
        ///// How many users rated this index?
        ///// </summary>
        //public decimal DynamicElementIndexValueCount
        //{
        //    get
        //    {
        //        if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicElementIndex)
        //            throw new InvalidOperationException("Invalid index type");

        //        return UserValueSet.Count();
        //    }
        //}

        ///// <summary>
        ///// Determines the average rating of this index.
        ///// It will be used to determine the weight of this index in its resource pool.
        ///// </summary>
        //public decimal DynamicElementIndexValueAverage
        //{
        //    get
        //    {
        //        if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicElementIndex)
        //            throw new InvalidOperationException("Invalid index type");

        //        return UserValueSet.Any()
        //            ? UserValueSet.Average(item => item.Rating)
        //            : 0;
        //    }
        //}

        ///// <summary>
        ///// Determines the rating percentage of this index.
        ///// </summary>
        //public decimal DynamicElementIndexValuePercentage
        //{
        //    get
        //    {
        //        if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicElementIndex)
        //            throw new InvalidOperationException("Invalid index type");

        //        return ResourcePoolIndex.IndexValue == 0
        //            ? 0
        //            : DynamicIndexValueAverage / ResourcePoolIndex.IndexValue;
        //    }
        //}
    }
}
