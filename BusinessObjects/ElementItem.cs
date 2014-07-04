namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("Element Item")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementItem : BaseEntity
    {
        public ElementItem()
        {
            OrganizationElementItemSet = new HashSet<OrganizationElementItem>();
            UserResourcePoolIndexElementItemSet = new HashSet<UserResourcePoolIndexElementItem>();
            UserElementItemSet = new HashSet<UserElementItem>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Display(Name = "Element Item")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public int ElementId { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<OrganizationElementItem> OrganizationElementItemSet { get; set; }
        public virtual ICollection<UserResourcePoolIndexElementItem> UserResourcePoolIndexElementItemSet { get; set; }
        public virtual ICollection<UserElementItem> UserElementItemSet { get; set; }

        /* */

        public int RatingCount
        {
            get { return UserElementItemSet.Count(); }
        }

        public decimal RatingAverage
        {
            get
            {
                return UserElementItemSet.Any()
                    ? UserElementItemSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal RatingPercentage
        {
            get
            {
                return Element.RatingAverage == 0
                    ? 0
                    : RatingAverage / Element.RatingAverage;
            }
        }

    }
}
