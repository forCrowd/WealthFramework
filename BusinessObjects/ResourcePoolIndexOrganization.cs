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
        public decimal ResourcePoolIndex_IndexValue { get { return ResourcePoolIndex.IndexValue; } }

        internal ResourcePoolIndex ResourcePoolIndex { get; private set; }
        internal Organization Organization { get; private set; }

        internal IEnumerable<UserResourcePoolIndexValue> UserValueSet
        {
            get
            {
                return Organization.UserResourcePoolIndexValueSet.Where(item => item.UserResourcePoolIndex.ResourcePoolIndex == ResourcePoolIndex);
            }
        }

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal IndexValueCount
        {
            get { return UserValueSet.Count(); }
        }

        /// <summary>
        /// Determines the average rating of this index.
        /// It will be used to determine the weight of this index in its resource pool.
        /// </summary>
        public decimal DynamicIndexValueAverage
        {
            get
            {
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicIndex)
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
                if (ResourcePoolIndex.ResourcePoolIndexType != (byte)ResourcePoolIndexType.DynamicIndex)
                    throw new InvalidOperationException("Invalid index type");

                return ResourcePoolIndex.IndexValue == 0
                    ? 0
                    : DynamicIndexValueAverage / ResourcePoolIndex.IndexValue;
            }
        }
    }
}
