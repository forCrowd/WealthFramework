//namespace BusinessObjects
//{
//    using BusinessObjects.Attributes;
//    using System.ComponentModel;
//    using System.ComponentModel.DataAnnotations.Schema;

//    [DisplayName("User CMRP Dynamic Index Value")]
//    [BusinessObjects.Attributes.DefaultProperty("Id")]
//    public class UserResourcePoolIndexValue : BaseEntity
//    {
//        [DisplayOnListView(false)]
//        [DisplayOnEditView(false)]
//        public int Id { get; set; }

//        [Index("IX_UserResourcePoolIndexIdOrganizationId", 1, IsUnique = true)]
//        public int UserResourcePoolIndexId { get; set; }

//        [Index("IX_UserResourcePoolIndexIdOrganizationId", 2, IsUnique = true)]
//        public int OrganizationId { get; set; }

//        public decimal Rating { get; set; }

//        public virtual UserResourcePoolIndex UserResourcePoolIndex { get; set; }
//        public virtual Organization Organization { get; set; }

//        public string Name
//        {
//            get { return string.Format("{0} - {1}", UserResourcePoolIndex.Name, Organization.Name); }
//        }
//    }
//}
