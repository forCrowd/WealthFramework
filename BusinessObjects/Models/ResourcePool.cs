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
            EnableResourcePoolAddition = true;
            EnableSubtotals = true;
            ElementSet = new HashSet<Element>();
            //ElementFieldIndexSet = new HashSet<ElementFieldIndex>();
            UserResourcePoolSet = new HashSet<UserResourcePool>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool")]
        public string Name { get; set; }

        [Display(Name = "Initial Value")]
        public decimal InitialValue { get; set; }

        [Display(Name = "Enable CMRP Addition")]
        public bool EnableResourcePoolAddition { get; set; }

        [Display(Name = "Enable Subtotals")]
        public bool EnableSubtotals { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public bool IsSample { get; set; }

        public virtual ICollection<Element> ElementSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        public Element MainElement
        {
            get { return ElementSet.SingleOrDefault(element => element.IsMainElement); }
        }

        //public IEnumerable<ElementFieldIndex> ElementFieldIndexSet
        //{
        //    get { return ElementSet.SelectMany(item => item.ElementFieldIndexSet); }
        //}

        public decimal ResourcePoolRate()
        {
            return UserResourcePoolSet.Any()
                ? UserResourcePoolSet.Average(item => item.ResourcePoolRate)
                : 0;
        }

        public decimal ResourcePoolRatePercentage()
        {
            return ResourcePoolRate() / 100;
        }

        public decimal ResourcePoolAddition()
        {
            return MainElement.ElementItemSet.Sum(item => item.ResourcePoolAddition());
        }

        public decimal ResourcePoolCellValue()
        {
            return MainElement.ElementItemSet.Sum(item => item.ResourcePoolValue());
        }

        public decimal ResourcePoolValueIncludingAddition()
        {
            return MainElement.ElementItemSet.Sum(item => item.ResourcePoolValueIncludingAddition());
        }

        //public decimal TotalResourcePoolValue(User multiplierUser)
        //{
        //    return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolValue(multiplierUser));
        //}

        public decimal TotalResourcePoolAddition(User multiplierUser)
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolAddition(multiplierUser));
        }

        public decimal TotalResourcePoolValue(User multiplierUser)
        {
            return InitialValue + TotalResourcePoolAddition(multiplierUser);
        }

        public decimal TotalResourcePoolValueIncludingAddition(User multiplierUser)
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolValueIncludingAddition(multiplierUser));
        }

        public decimal TotalIncome(User multiplierUser)
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalIncome(multiplierUser));
        }

        #region - Methods -

        //public ElementFieldIndex AddIndex(string name, ElementField field)
        //{
        //    return AddIndex(name, field, null);
        //}

        //public ElementFieldIndex AddIndex(string name, ElementField field, RatingSortType? sortType)
        //{
        //    var index = new ElementFieldIndex(this, name, field);

        //    if (sortType.HasValue)
        //        index.RatingSortType = (byte)sortType;

        //    field.ElementFieldIndexSet.Add(index);
        //    ElementFieldIndexSet.Add(index);
        //    return index;
        //}

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

        public ResourcePool IncreaseMultiplier(User user)
        {
            MultiplierMethodValidations(user);

            foreach (var item in MainElement.ElementItemSet)
                item.MultiplierCell.SetValue(item.MultiplierValue(user) + 1M, user);

            return this;
        }

        public ResourcePool DecreaseMultiplier(User user)
        {
            MultiplierMethodValidations(user);

            foreach (var item in MainElement.ElementItemSet)
                if (item.MultiplierValue(user) > 0)
                    item.MultiplierCell.SetValue(item.MultiplierValue(user) - 1M, user);

            return this;
        }

        public ResourcePool ResetMultiplier(User user)
        {
            MultiplierMethodValidations(user);

            foreach (var item in MainElement.ElementItemSet)
                item.MultiplierCell.SetValue(0M, user);

            return this;
        }

        void MultiplierMethodValidations(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            if (MainElement == null)
                throw new InvalidOperationException("ResourcePool has no MainElement");

            if (!MainElement.HasMultiplierField)
                throw new InvalidOperationException("MainElement has no multiplier field");
        }

        public ResourcePool UpdateResourcePoolRate(User user, decimal rate)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            var userResourcePool = UserResourcePoolSet.SingleOrDefault(item => item.UserId == user.Id);

            if (userResourcePool == null)
                userResourcePool = AddUserResourcePool(user, rate);
            else
                userResourcePool.ResourcePoolRate = rate;

            return this;
        }

        #endregion
    }
}
