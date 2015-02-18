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
        {
            ElementCellSet = new HashSet<ElementCell>();
            ElementFieldIndexSet = new HashSet<ElementFieldIndex>();
        }

        //public ElementField(Element element, string name, ElementFieldTypes fieldType, byte sortOrder)
        //{
        //    bool? fixedValue = null;

        //    if (fieldType == ElementFieldTypes.Multiplier)
        //        fixedValue = false;

        //    Init(element, name, fieldType, fixedValue, sortOrder);
        //}

        //public ElementField(Element element, string name, ElementFieldTypes fieldType, bool fixedValue, byte sortOrder)
        //{
        //    Init(element, name, fieldType, fixedValue, sortOrder);
        //}

        //public ElementField(Element element, string name, ElementFieldTypes fieldType, byte sortOrder)
        //{
        //    bool? fixedValue = null;

        //    if (fieldType == ElementFieldTypes.Multiplier)
        //        fixedValue = false;

        //    Init(element, name, fieldType, fixedValue, sortOrder);
        //}

        public ElementField(Element element, string name, ElementFieldTypes fieldType, byte sortOrder, bool? useFixedValue = null) : this()
        {
            //Init(element, name, fieldType, fixedValue, sortOrder);
        //}

        //void Init(Element element, string name, ElementFieldTypes fieldType, bool? fixedValue, byte sortOrder)
        //{
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");
            Validations.ArgumentNullOrDefault(sortOrder, "sortOrder");

            // fixedValue fix + validations
            if (fieldType == ElementFieldTypes.Multiplier)
                useFixedValue = false;

            if ((fieldType == ElementFieldTypes.String
                || fieldType == ElementFieldTypes.Element)
                && useFixedValue.HasValue)
                throw new ArgumentException(string.Format("fixedValue cannot have a value for {0} type", fieldType), "fixedValue");

            if ((fieldType != ElementFieldTypes.String
                && fieldType != ElementFieldTypes.Element)
                && !useFixedValue.HasValue)
                throw new ArgumentException(string.Format("fixedValue must have a value for {0} type", fieldType), "fixedValue");

            if (fieldType == ElementFieldTypes.Multiplier
                && useFixedValue.Value)
                throw new ArgumentException("fixedValue cannot be true for Multiplier type", "fixedValue");

            Element = element;
            Name = name;
            ElementFieldType = (byte)fieldType;
            UseFixedValue = useFixedValue;
            SortOrder = sortOrder;
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

        [Display(Name = "Selected Element")]
        public int? SelectedElementId { get; set; }

        /// <summary>
        /// Determines whether this field will use a fixed value from the CMRP owner or it will have user rateable values
        /// </summary>
        [Display(Name = "Use Fixed Value")]
        public bool? UseFixedValue { get; set; }

        [Display(Name = "Sort Order")]
        public byte SortOrder { get; set; }

        //[Required]
        //[Display(Name = "Is CMRP Field")]
        //public bool IsResourcePoolField { get; set; }

        public virtual Element Element { get; set; }
        public virtual Element SelectedElement { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<ElementFieldIndex> ElementFieldIndexSet { get; set; }

        #region - ReadOnly Properties -

        ///// <summary>
        ///// REMARK: In other index types, this value is calculated on ElementFieldIndex class level, under IndexValue property
        ///// </summary>
        //public decimal Value()
        //{
        //    return ElementCellSet.Sum(item => item.Value());
        //}

        //public decimal RatingPercentageMultiplied
        //{
        //    get
        //    {
        //        return ElementCellSet.Sum(item => item.RatingPercentageMultiplied);
        //    }
        //}

        public decimal ValueMultiplied()
        {
            return ElementCellSet.Sum(item => item.ValueMultiplied());
        }

        public decimal ValuePercentage()
        {
            return ElementCellSet.Sum(item => item.ValuePercentage());
        }

        // TODO Although technically it's possible to define multiple indexes, there will be one per Field at the moment
        public ElementFieldIndex ElementFieldIndex
        {
            get { return ElementFieldIndexSet.SingleOrDefault(); }
        }

        //public decimal ElementFieldIndexShare()
        //{
        //    return ElementFieldIndex == null
        //        ? 0
        //        : ElementFieldIndex.IndexShare();
        //}

        #endregion

        #region - Methods -

        public ElementFieldIndex AddIndex(string name, RatingSortType sortType)
        {
            var index = new ElementFieldIndex(this, name);
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
