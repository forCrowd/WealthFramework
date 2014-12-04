namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
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
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ResourcePool()
        { }

        public ResourcePool(string name)
        {
            Validations.ArgumentNullOrDefault(name, "name");

            Name = name;
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

        public ResourcePoolIndex AddIndex(string name, ElementField field)
        {
            return AddIndex(name, field, null);
        }

        public ResourcePoolIndex AddIndex(string name, ElementField field, RatingSortType? sortType)
        {
            var index = new ResourcePoolIndex(this, name, field);

            if (sortType.HasValue)
                index.RatingSortType = (byte)sortType;

            field.ResourcePoolIndexSet.Add(index);
            ResourcePoolIndexSet.Add(index);
            return index;
        }

        public Element AddElement(string name)
        {
            var element = new Element(this, name);
            ElementSet.Add(element);
            return element;
        }

        public UserResourcePool AddUserResourcePool(User user, decimal rate)
        {
            // Todo Validation?
            var userResourcePool = new UserResourcePool(user, this, rate);
            user.UserResourcePoolSet.Add(userResourcePool);
            UserResourcePoolSet.Add(userResourcePool);
            return userResourcePool;
        }

        public ResourcePool IncreaseMultiplier()
        {
            if (MainElement != null && MainElement.HasMultiplierField)
                foreach (var item in MainElement.ElementItemSet)
                    item.MultiplierCell.DecimalValue++;

            return this;
        }

        public ResourcePool DecreaseMultiplier()
        {
            if (MainElement != null && MainElement.HasMultiplierField)
                foreach (var item in MainElement.ElementItemSet)
                    item.MultiplierCell.DecimalValue--;

            return this;
        }

        public ResourcePool ResetMultiplier()
        {
            if (MainElement != null && MainElement.HasMultiplierField)
                foreach (var item in MainElement.ElementItemSet)
                    item.MultiplierCell.DecimalValue = 0;

            return this;
        }

        #endregion
    }
}
