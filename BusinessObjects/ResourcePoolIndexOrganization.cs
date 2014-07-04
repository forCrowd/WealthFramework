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

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal DynamicIndexValueCount
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
        public decimal DynamicIndexValueAverage
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
        public decimal DynamicIndexValuePercentage
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicOrganizationIndex)
                    throw new InvalidOperationException("Invalid index type");

                return ResourcePoolIndex.IndexValue == 0
                    ? 0
                    : DynamicIndexValueAverage / ResourcePoolIndex.IndexValue;
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
