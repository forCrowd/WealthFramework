namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
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
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public ElementField()
            //: this(new Element(), "Default Field", ElementFieldTypes.Boolean)
        { }

        public ElementField(Element element, string name, ElementFieldTypes fieldType)
        {
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");

            Element = element;
            Name = name;
            ElementFieldType = (byte)fieldType;
            ElementCellSet = new HashSet<ElementCell>();
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
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ResourcePoolIndex class level, under IndexValue property
        /// </summary>
        public decimal RatingAverage
        {
            get
            {
                return ElementCellSet.Sum(item => item.RatingAverage);
            }
        }


        //public decimal RatingPercentageMultiplied
        //{
        //    get
        //    {
        //        return ElementCellSet.Sum(item => item.RatingPercentageMultiplied);
        //    }
        //}

        public decimal RatingAverageMultiplied
        {
            get { return ElementCellSet.Sum(item => item.RatingAverageMultiplied); }
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
