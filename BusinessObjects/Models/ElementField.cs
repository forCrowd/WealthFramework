namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("Element Field")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementField : BaseEntity
    {
        public ElementField()
        {
            ElementItemElementFieldSet = new HashSet<ElementCell>();
            ResourcePoolIndexSet = new HashSet<ResourcePoolIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ElementId { get; set; }

        [Display(Name = "Element Field")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Element Field Type")]
        public byte ElementFieldType { get; set; }

        //[Required]
        //[Display(Name = "Is CMRP Field")]
        //public bool IsResourcePoolField { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementItemElementFieldSet { get; set; }
        public virtual ICollection<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ResourcePoolIndex class level, under IndexValue property
        /// </summary>
        public decimal RatingAverage
        {
            get
            {
                return ElementItemElementFieldSet.Sum(item => item.RatingAverage);
            }
        }


        //public decimal RatingPercentageMultiplied
        //{
        //    get
        //    {
        //        return ElementItemElementFieldSet.Sum(item => item.RatingPercentageMultiplied);
        //    }
        //}

        public decimal RatingAverageMultiplied
        {
            get { return ElementItemElementFieldSet.Sum(item => item.RatingAverageMultiplied); }
        }

        // TODO Although technically it's possible to define multiple indexes, there will be one per Field at the moment
        public ResourcePoolIndex ResourcePoolIndex
        {
            get { return ResourcePoolIndexSet.SingleOrDefault(); }
        }

        public decimal ResourcePoolIndexShare
        {
            get
            {
                return ResourcePoolIndex == null
                    ? 0
                    : ResourcePoolIndex.IndexShare;
            }
        }

        public override string ToString()
        {
            return Name;
        }

        #endregion
    }
}
