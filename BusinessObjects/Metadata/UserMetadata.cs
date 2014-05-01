namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Email")]
    public class UserMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [StringLength(256)]
        public object AspNetUserId { get; set; }

        [Display(Name = "Email")]
        [Required]
        [StringLength(100)]
        public object Email { get; set; }

        [Display(Name = "Password")]
        [DisplayOnListView(false)]
        [Required]
        [StringLength(50)]
        public string Password { get; set; }

        [Display(Name = "First Name")]
        [StringLength(50)]
        public object FirstName { get; set; }
    
        [Display(Name = "Middle Name")]
        [StringLength(50)]
        public object MiddleName { get; set; }
    
        [Display(Name = "Last Name")]
        [StringLength(50)]
        public object LastName { get; set; }

        [Display(Name = "User Account Type")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object UserAccountTypeId { get; set; }

        [DisplayOnListView(false)]
        public object Notes { get; set; }

        [Display(Name = "Created On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object CreatedOn { get; set; }

        [Display(Name = "Modified On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object ModifiedOn { get; set; }

        [Display(Name = "Deleted On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object DeletedOn { get; set; }
    }
}
