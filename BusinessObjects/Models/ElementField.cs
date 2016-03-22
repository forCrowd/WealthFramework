namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    // [ODataControllerAuthorization("Administrator")]
    public class ElementField : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementField()
        {
            ElementCellSet = new HashSet<ElementCell>();
            UserElementFieldSet = new HashSet<UserElementField>();
        }

        public ElementField(Element element, string name, ElementFieldDataType fieldType, byte sortOrder, bool? useFixedValue = null) : this()
        {
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");
            Validations.ArgumentNullOrDefault(sortOrder, "sortOrder");

            // fixedValue fix + validations
            if (fieldType == ElementFieldDataType.Multiplier)
                useFixedValue = false;

            if ((fieldType == ElementFieldDataType.String
                || fieldType == ElementFieldDataType.Element)
                && useFixedValue.HasValue)
                throw new ArgumentException(string.Format("fixedValue cannot have a value for {0} type", fieldType), "fixedValue");

            if ((fieldType != ElementFieldDataType.String
                && fieldType != ElementFieldDataType.Element)
                && !useFixedValue.HasValue)
                throw new ArgumentException(string.Format("fixedValue must have a value for {0} type", fieldType), "fixedValue");

            if (fieldType == ElementFieldDataType.Multiplier
                && useFixedValue.Value)
                throw new ArgumentException("fixedValue cannot be true for Multiplier type", "fixedValue");

            Element = element;
            Name = name;
            DataType = (byte)fieldType;
            UseFixedValue = useFixedValue;
            SortOrder = sortOrder;
        }

        public int Id { get; set; }

        public int ElementId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        public byte DataType { get; set; }

        public int? SelectedElementId { get; set; }

        /// <summary>
        /// Determines whether this field will use a fixed value from the CMRP owner or it will have user rateable values
        /// </summary>
        public bool? UseFixedValue { get; set; }

        public bool IndexEnabled { get; set; }

        public byte IndexCalculationType { get; set; }

        public byte IndexSortType { get; set; }

        public byte SortOrder { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? IndexRatingTotal { get; private set; }
        
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
            ValidateEnableIndex();

            IndexEnabled = true;
            IndexCalculationType = (byte)ElementFieldIndexCalculationType.Aggressive;
            IndexSortType = (byte)ElementFieldIndexSortType.HighestToLowest;
            return this;
        }

        public ElementField EnableIndex(ElementFieldIndexSortType indexSortType)
        {
            ValidateEnableIndex();

            IndexEnabled = true;
            IndexCalculationType = (byte)ElementFieldIndexCalculationType.Aggressive;
            IndexSortType = (byte)indexSortType;
            return this;
        }

        public ElementField EnableIndex(ElementFieldIndexCalculationType calculationType, ElementFieldIndexSortType indexSortType)
        {
            ValidateEnableIndex();

            IndexEnabled = true;
            IndexCalculationType = (byte)calculationType;
            IndexSortType = (byte)indexSortType;
            return this;
        }

        void ValidateEnableIndex()
        {
            if (DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String)
            {
                throw new InvalidOperationException(string.Format("Index cannot be enabled for this type: {0}", DataType));
            }
        }

        public override string ToString()
        {
            return Name;
        }

        #endregion
    }
}
