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

        [Display(Name = "Index Rating Sort Type")]
        public byte IndexRatingSortType { get; set; }

        [Display(Name = "Sort Order")]
        public byte SortOrder { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? IndexRatingAverage { get; private set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? IndexRatingCount { get; private set; }

        public virtual Element Element { get; set; }
        public virtual Element SelectedElement { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<ElementFieldIndex> ElementFieldIndexSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }

        #region - ReadOnly Properties -

        public decimal ValueMultiplied()
        {
            return ElementCellSet.Sum(item => item.RatingMultiplied());
        }

        public decimal ValuePercentage()
        {
            return ElementCellSet.Sum(item => item.RatingPercentage());
        }

        public UserElementField UserElementField
        {
            get
            {
                return UserElementFieldSet.SingleOrDefault();
            }
        }

        // TODO Although technically it's possible to define multiple indexes, there will be one per Field at the moment
        public ElementFieldIndex ElementFieldIndex
        {
            get { return ElementFieldIndexSet.SingleOrDefault(); }
        }

        public decimal? OtherUsersIndexRatingTotal
        {
            get
            {
                if (!IndexRatingAverage.HasValue)
                    return null;

                var average = IndexRatingAverage.Value;
                var count = IndexRatingCount.GetValueOrDefault(0);
                var total = average * count;

                if (UserElementField != null)
                    total -= UserElementField.Rating;

                return total;
            }
        }

        public int OtherUsersIndexRatingCount
        {
            get
            {
                var count = IndexRatingCount.GetValueOrDefault(0);

                if (UserElementField != null)
                    count--;

                return count;
            }
        }

        #endregion

        #region - Methods -

        public UserElementField AddUserRating(User user, decimal rating)
        {
            // TODO Validation?
            var userRating = new UserElementField(user, this, rating);
            user.UserElementFieldSet.Add(userRating);
            UserElementFieldSet.Add(userRating);
            return userRating;
        }

        public ElementFieldIndex AddIndex(string name, RatingSortType sortType)
        {
            this.IndexEnabled = true;
            this.IndexRatingSortType = (byte)sortType;

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
