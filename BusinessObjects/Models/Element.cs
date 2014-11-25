namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        public Element()
        {
            ElementFieldSet = new HashSet<ElementField>();
            ElementItemSet = new HashSet<ElementItem>();
            ResourcePoolIndexSet = new HashSet<ResourcePoolIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Display(Name = "Element")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Display(Name = "Main Element")]
        public bool IsMainElement { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual ICollection<ElementField> ElementFieldSet { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }
        public virtual ICollection<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ResourcePoolIndex class level, under IndexValue property
        /// </summary>
        //public decimal RatingAverage
        //{
        //    get { return ElementItemSet.Sum(item => item.RatingAverage); }
        //}

        public IEnumerable<ElementField> BasicElementFieldSet
        {
            get
            {
                return ElementFieldSet.Where(item => item.ElementFieldType != (byte)ElementFieldType.ResourcePool
                    && item.ElementFieldType != (byte)ElementFieldType.Multiplier);
            }
        }

        public ElementField ResourcePoolField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldType.ResourcePool); }
        }

        public bool HasResourcePoolField
        {
            get { return ResourcePoolField != null; }
        }

        public string ResourcePoolFieldName
        {
            get
            {
                if (!HasResourcePoolField)
                    return string.Empty;

                return ResourcePoolField.Name;
            }
        }

        public ElementField MultiplierField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldType.Multiplier); }
        }

        public bool HasMultiplierField
        {
            get
            {
                return MultiplierField != null;
            }
        }

        public string MultiplierFieldName
        {
            get
            {
                if (!HasMultiplierField)
                    return string.Empty;

                return MultiplierField.Name;
            }
        }

        #endregion

        #region - Methods -

        public Element AddField(ElementField field)
        {
            // TODO Validation - Same name?

            field.Element = this;
            ElementFieldSet.Add(field);
            return this;
        }

        public Element AddItem(ElementItem item)
        {
            // TODO Validation - Same name?

            item.Element = this;
            ElementItemSet.Add(item);
            return this;
        }

        #endregion
    }
}
