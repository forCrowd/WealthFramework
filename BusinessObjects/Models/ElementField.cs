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
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementField()
        { }

        public ElementField(Element element, string name, bool fixedValue, ElementFieldTypes fieldType)
        {
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");

            Element = element;
            Name = name;
            FixedValue = fixedValue;
            ElementFieldType = (byte)fieldType;
            ElementCellSet = new HashSet<ElementCell>();
            ElementFieldIndexSet = new HashSet<ElementFieldIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ElementId { get; set; }

        [Display(Name = "Element Field")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        /// <summary>
        /// Determines whether this field will use a fixed value from the CMRP owner or it will have user rateable values
        /// </summary>
        [Display(Name = "Fixed Value")]
        [Required]
        public bool FixedValue { get; set; }

        [Required]
        [Display(Name = "Element Field Type")]
        public byte ElementFieldType { get; set; }

        //[Required]
        //[Display(Name = "Is CMRP Field")]
        //public bool IsResourcePoolField { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<ElementFieldIndex> ElementFieldIndexSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ElementFieldIndex class level, under IndexValue property
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
        public ElementFieldIndex ElementFieldIndex
        {
            get { return ElementFieldIndexSet.SingleOrDefault(); }
        }

        public decimal ElementFieldIndexShare
        {
            get
            {
                return ElementFieldIndex == null
                    ? 0
                    : ElementFieldIndex.IndexShare;
            }
        }

#endregion

        #region - Methods -

        public ElementFieldIndex AddIndex(string name, RatingSortType? sortType)
        {
            var index = new ElementFieldIndex(this, name);

            if (sortType.HasValue)
                index.RatingSortType = (byte)sortType;

            ElementFieldIndexSet.Add(index);
            return index;
        }

        public override string ToString()
        {
            return Name;
        }

        #endregion
    }
}
