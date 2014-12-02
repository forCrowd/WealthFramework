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

    [DisplayName("CMRP Index")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePoolIndex : BaseEntity
    {
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public ResourcePoolIndex()
            //: this(new ResourcePool(), "Default Index", new ElementField())
        { }

        public ResourcePoolIndex(ResourcePool resourcePool, string name, ElementField field)
        {
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");
            Validations.ArgumentNullOrDefault(name, "name");
            Validations.ArgumentNullOrDefault(field, "field");

            ResourcePool = resourcePool;
            Name = name;
            ElementField = field;
            UserResourcePoolIndexSet = new HashSet<UserResourcePoolIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool Index")]
        public string Name { get; set; }

        //public Nullable<int> ElementId { get; set; }
        public Nullable<int> ElementFieldId { get; set; }

        [Required]
        [Display(Name = "Rating Sort Type")]
        public byte RatingSortType { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        // public virtual Element Element { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ICollection<UserResourcePoolIndex> UserResourcePoolIndexSet { get; set; }

        /* */

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal IndexRatingCount
        {
            get { return UserResourcePoolIndexSet.Count(); }
        }

        /// <summary>
        /// What is the average rating for this index?
        /// It will be used to determine the weight of this index in its resource pool.
        /// </summary>
        public decimal IndexRatingAverage
        {
            get
            {
                return UserResourcePoolIndexSet.Any()
                    ? UserResourcePoolIndexSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal IndexRatingPercentage
        {
            get
            {
                return ResourcePool.IndexRatingAverage == 0
                    ? 0
                    : IndexRatingAverage / ResourcePool.IndexRatingAverage;
            }
        }

        public decimal IndexShare
        {
            get { return ResourcePool.TotalResourcePoolAddition * IndexRatingPercentage; }
        }
    }
}
