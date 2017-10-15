using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public enum ElementFieldDataType : byte
    {
        /// <summary>
        /// A field that holds string value.
        /// Use StringValue property to set its value on ElementItem level.
        /// </summary>
        String = 1,

        /// <summary>
        /// A field that holds decimal value.
        /// Use DecimalValue property to set its value on ElementItem level.
        /// </summary>
        Decimal = 4,

        /// <summary>
        /// A field that holds another defined Element object within the resource pool.
        /// Use SelectedElementItem property to set its value on ElementItem level.
        /// </summary>
        Element = 6,
    }

    public class ElementField : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementField()
        {
            ElementCellSet = new HashSet<ElementCell>();
            UserElementFieldSet = new HashSet<UserElementField>();
        }

        public ElementField(Element element, string name, ElementFieldDataType fieldType, byte sortOrder, bool useFixedValue) : this()
        {
            Validations.ArgumentNullOrDefault(element, nameof(element));
            Validations.ArgumentNullOrDefault(name, nameof(name));
            Validations.ArgumentNullOrDefault(sortOrder, nameof(sortOrder));

            // fixedValue fix: String and Element types can only be useFixedValue = true
            if (fieldType == ElementFieldDataType.String || fieldType == ElementFieldDataType.Element)
            {
                useFixedValue = true;
            }

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
        public bool UseFixedValue { get; set; }

        public bool IndexEnabled { get; set; }

        public byte SortOrder { get; set; }

        public decimal IndexRatingTotal { get; set; }
        public int IndexRatingCount { get; set; }

        public virtual Element Element { get; set; }
        public virtual Element SelectedElement { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }

        #region - Methods -

        public void AddUserRating(decimal rating)
        {
            // TODO Validation?

            var userRating = new UserElementField(this, rating);
            UserElementFieldSet.Add(userRating);
        }

        public ElementField EnableIndex()
        {
            if (DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String)
            {
                throw new InvalidOperationException($"Index cannot be enabled for this type: {DataType}");
            }

            IndexEnabled = true;

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
