namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

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

        // Can't use Enum itself, OData v3 doesn't allow it:
        // System.Runtime.Serialization.SerializationException 'forCrowd.WealthEconomy.BusinessObjects.ElementFieldDataType' cannot be serialized using the ODataMediaTypeFormatter.
        // coni2k - 02 Jul. '17
        [Required]
        public byte DataType { get; set; }

        public int? SelectedElementId { get; set; }

        /// <summary>
        /// Determines whether this field will use a fixed value from the CMRP owner or it will have user rateable values
        /// </summary>
        public bool? UseFixedValue { get; set; }

        public bool IndexEnabled { get; set; }

        // See 'DataType' for enum remark
        public byte IndexCalculationType { get; set; }

        // See 'DataType' for enum remark
        public byte IndexSortType { get; set; }

        public byte SortOrder { get; set; }

        public decimal IndexRatingTotal { get; set; }
        public int IndexRatingCount { get; set; }

        public virtual Element Element { get; set; }
        public virtual Element SelectedElement { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }

        #region - Methods -

        public UserElementField AddUserRating(decimal rating)
        {
            // TODO Validation?

            var userRating = new UserElementField(this, rating);
            UserElementFieldSet.Add(userRating);
            return userRating;
        }

        public ElementField EnableIndex()
        {
            return EnableIndex(ElementFieldIndexCalculationType.Aggressive, ElementFieldIndexSortType.HighestToLowest);
        }

        public ElementField EnableIndex(ElementFieldIndexSortType indexSortType)
        {
            return EnableIndex(ElementFieldIndexCalculationType.Aggressive, indexSortType);
        }

        public ElementField EnableIndex(ElementFieldIndexCalculationType calculationType, ElementFieldIndexSortType indexSortType)
        {
            if (DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String)
            {
                throw new InvalidOperationException(string.Format("Index cannot be enabled for this type: {0}", DataType));
            }

            IndexEnabled = true;
            IndexCalculationType = (byte)calculationType;
            IndexSortType = (byte)indexSortType;

            IndexRatingTotal = 50; // Computed field
            IndexRatingCount = 1; // Computed field

            AddUserRating(50);

            return this;
        }

        // TODO Where is DisableIndex my dear?! / coni2k - 11 Jun. '16

        public override string ToString()
        {
            return Name;
        }

        #endregion
    }
}
