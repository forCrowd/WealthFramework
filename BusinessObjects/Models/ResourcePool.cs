namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Security.Permissions;

    [DisplayName("CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePool : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ResourcePool()
        {
            ElementSet = new HashSet<Element>();
            UserResourcePoolSet = new HashSet<UserResourcePool>();

            //FilterSettings = new ResourcePoolFilterSettings();
        }

        public ResourcePool(string name) : this()
        {
            Validations.ArgumentNullOrDefault(name, "name");

            Name = name;
            EnableResourcePoolAddition = true;
            EnableSubtotals = true;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool")]
        public string Name { get; set; }

        [Display(Name = "Initial Value")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(true)]
        [Obsolete("Doesn't work as expected, remove later")]
        public decimal InitialValue { get; set; }

        [Display(Name = "Enable CMRP Addition")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(true)]
        public bool EnableResourcePoolAddition { get; set; }

        [Display(Name = "Enable Subtotals")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(true)]
        public bool EnableSubtotals { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public bool IsSample { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? ResourcePoolRateAverage { get; private set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? ResourcePoolRateCount { get; private set; }

        public virtual ICollection<Element> ElementSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        //public ResourcePoolFilterSettings FilterSettings { get; private set; }

        public Element MainElement
        {
            get { return ElementSet.SingleOrDefault(element => element.IsMainElement); }
        }

        //public IEnumerable<ElementFieldIndex> ElementFieldIndexSet
        //{
        //    get { return ElementSet.SelectMany(item => item.ElementFieldIndexSet); }
        //}



        [NotMapped]
        public decimal ResourcePoolRateOld
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.ResourcePoolRate)
                    : 0;
            }
            set { }
        }

        public decimal ResourcePoolRatePercentage()
        {
            return ResourcePoolRateOld / 100;
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

        public decimal TotalResourcePoolAddition()
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolAddition());
        }

        public decimal TotalResourcePoolValue()
        {
            //return InitialValue + TotalResourcePoolAddition(multiplierUser);
            return TotalResourcePoolAddition();
        }

        public decimal TotalResourcePoolValueIncludingAddition()
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalResourcePoolValueIncludingAddition());
        }

        public decimal TotalIncome()
        {
            return MainElement.ElementItemSet.Sum(item => item.TotalIncome());
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
                item.MultiplierCell.SetValue(item.MultiplierValue() + 1M, user);

            return this;
        }

        public ResourcePool DecreaseMultiplier(User user)
        {
            MultiplierMethodValidations(user);

            foreach (var item in MainElement.ElementItemSet)
            {
                var multiplierValue = item.MultiplierValue();
                if (multiplierValue > 0)
                    item.MultiplierCell.SetValue(multiplierValue - 1M, user);
            }

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
