namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePool : BaseEntity
    {
        public ResourcePool()
        {
            ElementSet = new HashSet<Element>();
            ResourcePoolIndexSet = new HashSet<ResourcePoolIndex>();
            UserResourcePoolSet = new HashSet<UserResourcePool>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool")]
        public string Name { get; set; }

        [Required]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public bool IsSample { get; set; }

        public virtual ICollection<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        public decimal ResourcePoolRate
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.ResourcePoolRate)
                    : 0;
            }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
        }

        public decimal IndexRatingAverage
        {
            get { return ResourcePoolIndexSet.Sum(item => item.IndexRatingAverage); }
        }

        public Element MainElement
        {
            get { return ElementSet.SingleOrDefault(element => element.IsMainElement); }
        }

        public decimal ResourcePoolAddition
        {
            get { return MainElement.ElementItemSet.Sum(item => item.ResourcePoolAddition); }
        }

        public decimal ResourcePoolCellValue
        {
            get { return MainElement.ElementItemSet.Sum(item => item.ResourcePoolCellValue); }
        }

        public decimal ResourcePoolValueIncludingAddition
        {
            get { return MainElement.ElementItemSet.Sum(item => item.ResourcePoolValueIncludingAddition); }
        }

        public decimal TotalResourcePoolValue
        {
            get { return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolValue); }
        }

        public decimal TotalResourcePoolAddition
        {
            get { return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolAddition); }
        }

        public decimal TotalResourcePoolValueIncludingAddition
        {
            get { return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolValueIncludingAddition); }
        }

        public decimal TotalIncome
        {
            get { return MainElement.ElementItemSet.Sum(item => item.TotalIncome); }
        }

        #region - Methods -

        public ResourcePool AddIndex(ResourcePoolIndex index)
        {
            // TODO Validation?
            index.ResourcePool = this;
            ResourcePoolIndexSet.Add(index);
            return this;
        }

        public ResourcePool AddElement(Element element)
        {
            // TODO Validation?
            element.ResourcePool = this;
            ElementSet.Add(element);
            return this;
        }

        public ResourcePool AddUserResourcePool(UserResourcePool userResourcePool)
        {
            // TODO Validation?
            userResourcePool.ResourcePool = this;
            UserResourcePoolSet.Add(userResourcePool);
            return this;
        }

        #endregion
    }
}
