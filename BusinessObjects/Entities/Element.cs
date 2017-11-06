using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class Element : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Element()
        {
            ElementFieldSet = new HashSet<ElementField>();
            ElementItemSet = new HashSet<ElementItem>();
            ParentFieldSet = new HashSet<ElementField>();
        }

        public Element(ResourcePool resourcePool, string name)
            : this()
        {
            Validations.ArgumentNullOrDefault(resourcePool, nameof(resourcePool));
            Validations.ArgumentNullOrDefault(name, nameof(name));

            ResourcePool = resourcePool;
            Name = name;
        }

        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        public bool IsMainElement { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        public virtual ICollection<ElementField> ElementFieldSet { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }
        [InverseProperty("SelectedElement")]
        public virtual ICollection<ElementField> ParentFieldSet { get; set; }

        #region - Methods -

        public ElementField AddField(string name, ElementFieldDataType fieldType, bool useFixedValue = true)
        {
            // TODO Validation - Same name?
            var sortOrder = Convert.ToByte(ElementFieldSet.Count + 1);
            var field = new ElementField(this, name, fieldType, sortOrder, useFixedValue);
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
