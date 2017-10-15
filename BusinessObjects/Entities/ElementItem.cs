using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class ElementItem : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementItem()
        {
            ElementCellSet = new HashSet<ElementCell>();
            ParentCellSet = new HashSet<ElementCell>();
        }

        public ElementItem(Element element, string name) : this()
        {
            Validations.ArgumentNullOrDefault(element, nameof(element));
            Validations.ArgumentNullOrDefault(name, nameof(name));

            Element = element;
            Name = name;
        }

        public int Id { get; set; }

        public int ElementId { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        [InverseProperty("SelectedElementItem")]
        public virtual ICollection<ElementCell> ParentCellSet { get; set; }

        #region - Methods -

        public ElementCell AddCell(ElementField field)
        {
            Validations.ArgumentNullOrDefault(field, nameof(field));

            if (ElementCellSet.Any(item => item.ElementField == field))
                throw new Exception("An element item can't have more than one cell for the same field.");

            var cell = new ElementCell(field, this);
            field.ElementCellSet.Add(cell);
            ElementCellSet.Add(cell);
            return cell;
        }

        #endregion
    }
}
