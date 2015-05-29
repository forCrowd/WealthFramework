namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Security.Permissions;

    [DisplayName("CMRP")]
    [forCrowd.WealthEconomy.BusinessObjects.Attributes.DefaultProperty("Name")]
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

        public ResourcePool(User user, string name)
            : this()
        {
            Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(name, "name");

            User = user;
            Name = name;
            EnableResourcePoolAddition = true;
            EnableSubtotals = true;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool")]
        public string Name { get; set; }

        [Display(Name = "Initial Value")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(true)]
        public decimal InitialValue { get; set; }

        [Display(Name = "Main Element")]
        public int? MainElementId { get; set; }

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
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? ResourcePoolRateAverage { get; private set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? ResourcePoolRateCount { get; private set; }

        public virtual User User { get; set; }
        public virtual Element MainElement { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        public UserResourcePool UserResourcePool
        {
            get
            {
                return UserResourcePoolSet.SingleOrDefault();

                // TODO OBSOLETE?

                //if (!System.Threading.Thread.CurrentPrincipal.Identity.IsAuthenticated)
                //    return null;

                var identity = System.Threading.Thread.CurrentPrincipal.Identity as System.Security.Claims.ClaimsIdentity;
                if (identity == null)
                {
                    return null;
                }
                var userClaim = identity.Claims.SingleOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userClaim == null)
                {
                    return null;
                }

                var userId = 0;
                int.TryParse(userClaim.Value, out userId);

                return UserResourcePoolSet.SingleOrDefault(item => item.UserId == userId);

                //try
                //{
                //    return UserResourcePoolSet.SingleOrDefault();
                //}
                //catch (Exception ex)
                //{
                //    throw new Exception("Count: " + UserResourcePoolSet.Count, ex);
                //}
            }
        }

        public decimal? OtherUsersResourcePoolRateTotal
        {
            get
            {
                if (!ResourcePoolRateAverage.HasValue)
                    return null;

                var average = ResourcePoolRateAverage.Value;
                var count = ResourcePoolRateCount.GetValueOrDefault(0);
                var total = average * count;

                if (UserResourcePool != null)
                    total -= UserResourcePool.ResourcePoolRate;

                return total;
            }
        }

        //public decimal? OtherUsersResourcePoolRateAverage
        //{
        //    get
        //}

        public int OtherUsersResourcePoolRateCount
        {
            get
            {
                var count = ResourcePoolRateCount.GetValueOrDefault(0);

                if (UserResourcePool != null)
                    count--;

                return count;
            }
        }

        //[NotMapped]
        public decimal ResourcePoolRateOld
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.ResourcePoolRate)
                    : 0;
            }
            //set { }
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
            return MainElement.ElementItemSet.Sum(item => item.DirectIncomeValue());
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

        public UserResourcePool AddUserResourcePool(decimal rate)
        {
            var userResourcePool = new UserResourcePool(this, rate);
            UserResourcePoolSet.Add(userResourcePool);
            return userResourcePool;
        }

        [Obsolete("Try to switch to the method without user variable")]
        public UserResourcePool AddUserResourcePool(User user, decimal rate)
        {
            // Todo Validation?
            // var userResourcePool = new UserResourcePool(user, this, rate);
            var userResourcePool = new UserResourcePool(this, rate);
            user.UserResourcePoolSet.Add(userResourcePool);
            UserResourcePoolSet.Add(userResourcePool);
            return userResourcePool;
        }

        /// <summary>
        /// Sets the first element in its list as the main element
        /// </summary>
        /// <returns></returns>
        public ResourcePool SetMainElement()
        {
            if (MainElement != null)
            {
                // TODO What if there is an existing MainElement?
            }

            var mainElement = ElementSet.FirstOrDefault();
            if (mainElement != null)
            {
                MainElement = mainElement;
                mainElement.ResourcePoolMainElementSubSet.Add(this);
            }

            return this;
        }

        #endregion
    }
}
