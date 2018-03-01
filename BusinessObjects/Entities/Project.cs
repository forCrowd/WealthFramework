using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class Project : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Project()
        {
            ElementSet = new HashSet<Element>();
        }

        public Project(User user, string name)
            : this(user, name, name)
        {
        }

        public Project(User user, string name, string key)
            : this()
        {
            Validations.ArgumentNullOrDefault(user, nameof(user));
            Validations.ArgumentNullOrDefault(name, nameof(name));
            Validations.ArgumentNullOrDefault(key, nameof(key));

            User = user;
            Name = name;
        }

        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(5000)]
        public string Description { get; set; }

        public int RatingCount { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }

        #region - Methods -

        public Element AddElement(string name)
        {
            var element = new Element(this, name);
            ElementSet.Add(element);
            return element;
        }

        #endregion
    }
}
