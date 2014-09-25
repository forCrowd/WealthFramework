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
            ElementItemElementFieldSet = new HashSet<ElementItemElementField>();
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

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementItemElementField> ElementItemElementFieldSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ResourcePoolIndex class level, under IndexValue property
        /// </summary>
        public decimal RatingAverage
        {
            get
            {
                switch (ElementFieldType)
                {
                    case (byte)BusinessObjects.ElementFieldType.String:
                    case (byte)BusinessObjects.ElementFieldType.Decimal:
                    case (byte)BusinessObjects.ElementFieldType.Boolean:
                    case (byte)BusinessObjects.ElementFieldType.Integer:
                    case (byte)BusinessObjects.ElementFieldType.DateTime:
                        return ElementItemElementFieldSet.Sum(item => item.RatingAverage);
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        #endregion
    }
}
