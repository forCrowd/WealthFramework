namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DisplayName("Element Field")]
    [forCrowd.WealthEconomy.BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementField : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementField()
        {
            ElementCellSet = new HashSet<ElementCell>();
            UserElementFieldSet = new HashSet<UserElementField>();
        }

        public ElementField(Element element, string name, ElementFieldTypes fieldType, byte sortOrder, bool? useFixedValue = null) : this()
        {
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

        [Display(Name = "Index Enabled")]
        public bool IndexEnabled { get; set; }

        [Display(Name = "Index Type")]
        public byte IndexType { get; set; }

        [Display(Name = "Index Rating Sort Type")]
        public byte IndexRatingSortType { get; set; }

        [Display(Name = "Sort Order")]
        public byte SortOrder { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? IndexRatingTotal { get; private set; }
        
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? IndexRatingCount { get; private set; }

        public virtual Element Element { get; set; }
        public virtual Element SelectedElement { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }

        #region - Methods -

        public UserElementField AddUserRating(User user, decimal rating)
        {
            // TODO Validation?
            var userRating = new UserElementField(user, this, rating);
            user.UserElementFieldSet.Add(userRating);
            UserElementFieldSet.Add(userRating);
            return userRating;
        }

        public ElementField EnableIndex()
        {
            this.IndexEnabled = true;
            this.IndexType = (byte)BusinessObjects.IndexType.Aggressive;
            this.IndexRatingSortType = (byte)BusinessObjects.IndexRatingSortType.HighestToLowest;
            return this;
        }

        public ElementField EnableIndex(IndexRatingSortType ratingSortType)
        {
            this.IndexEnabled = true;
            this.IndexType = (byte)BusinessObjects.IndexType.Aggressive;
            this.IndexRatingSortType = (byte)ratingSortType;
            return this;
        }

        public ElementField EnableIndex(IndexType type, IndexRatingSortType ratingSortType)
        {
            this.IndexEnabled = true;
            this.IndexType = (byte)type;
            this.IndexRatingSortType = (byte)ratingSortType;
            return this;
        }

        public override string ToString()
        {
            return Name;
        }

        #endregion
    }
}
