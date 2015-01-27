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

    [DisplayName("Element Field Index")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementFieldIndex : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementFieldIndex()
        {
            UserElementFieldIndexSet = new HashSet<UserElementFieldIndex>();
        }

        public ElementFieldIndex(ElementField field, string name) : this()
        {
            //Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");
            Validations.ArgumentNullOrDefault(field, "field");
            Validations.ArgumentNullOrDefault(name, "name");

            // Field type validation
            if (field.ElementFieldType == (byte)ElementFieldTypes.String
                || field.ElementFieldType == (byte)ElementFieldTypes.Element)
                throw new ArgumentException("Invalid field: Index can't be created on 'String' or 'Element' typed fields", "field");

            //ResourcePool = resourcePool;
            Name = name;
            ElementField = field;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        //public int ResourcePoolId { get; set; }
        public int ElementFieldId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Element Field Index")]
        public string Name { get; set; }

        //public Nullable<int> ElementId { get; set; }

        [Required]
        [Display(Name = "Rating Sort Type")]
        public byte RatingSortType { get; set; }

        //public virtual ResourcePool ResourcePool { get; set; }
        // public virtual Element Element { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ICollection<UserElementFieldIndex> UserElementFieldIndexSet { get; set; }

        /* */

        public UserElementFieldIndex AddUserRating(User user, decimal rating)
        {
            // TODO Validation?
            var index = new UserElementFieldIndex(user, this, rating);
            user.UserElementFieldIndexSet.Add(index);
            UserElementFieldIndexSet.Add(index);
            return index;
        }

        public decimal ValueMultiplied()
        {
            return ElementField.ElementCellSet.Sum(item => item.ValueMultiplied());
        }

        public decimal ValuePercentage()
        {
            return ElementField.ElementCellSet.Sum(item => item.ValuePercentage());
        }

        public decimal ElementFieldIndexIncome()
        {
            return ElementField.ElementCellSet.Sum(item => item.ElementFieldIndexIncome());
        }

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal IndexRatingCount()
        {
            return UserElementFieldIndexSet.Count();
        }

        /// <summary>
        /// What is the average rating for this index?
        /// It will be used to determine the weight of this index in its resource pool.
        /// </summary>
        public decimal IndexRatingAverage()
        {
            return UserElementFieldIndexSet.Any()
                ? UserElementFieldIndexSet.Average(item => item.Rating)
                : 0;
        }

        public decimal IndexRatingPercentage()
        {
            var resourcePoolIndexRatingAverage = ElementField.Element.IndexRatingAverage();

            return resourcePoolIndexRatingAverage == 0
                ? 0
                : IndexRatingAverage() / resourcePoolIndexRatingAverage;
        }

        public decimal IndexShare()
        {
            return ElementField.Element.ResourcePool.TotalResourcePoolValue() * IndexRatingPercentage();
        }
    }
}
