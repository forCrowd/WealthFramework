namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Element()
        { }

        public Element(ResourcePool resourcePool, string name)
        {
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");
            Validations.ArgumentNullOrDefault(name, "name");

            ResourcePool = resourcePool;
            Name = name;
            IsMainElement = !ResourcePool.ElementSet.Any();
            
            ElementFieldSet = new HashSet<ElementField>();
            AddField("Name", true, ElementFieldTypes.String);

            ElementItemSet = new HashSet<ElementItem>();
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

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ElementFieldIndex class level, under IndexValue property
        /// </summary>
        //public decimal RatingAverage
        //{
        //    get { return ElementItemSet.Sum(item => item.RatingAverage); }
        //}

        public IEnumerable<ElementField> BasicElementFieldSet
        {
            get
            {
                return ElementFieldSet.Where(item => item.ElementFieldType != (byte)ElementFieldTypes.ResourcePool
                    && item.ElementFieldType != (byte)ElementFieldTypes.Multiplier);
            }
        }

        public IEnumerable<ElementFieldIndex> ElementFieldIndexSet
        {
            get
            {
                return ElementFieldSet
                    .Where(item => item.ElementFieldIndex != null)
                    .Select(field => field.ElementFieldIndex);
            }
        }

        public ElementField NameField
        {
            get { return BasicElementFieldSet.SingleOrDefault(item => item.Name == "Name"); }
        }

        public bool HasNameField
        {
            get { return NameField != null; }
        }

        public ElementField ResourcePoolField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.ResourcePool); }
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
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.Multiplier); }
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

        public ElementField AddField(string name, bool fixedValue, ElementFieldTypes fieldType)
        {
            // TODO Validation - Same name?

            var field = new ElementField(this, name, fixedValue, fieldType);
            ElementFieldSet.Add(field);
            return field;
        }

        public ElementItem AddItem(string name)
        {
            // TODO Validation - Same name?
            
            var item = new ElementItem(this, name);
            ElementItemSet.Add(item);
            return item;
        }

        #endregion
    }
}
