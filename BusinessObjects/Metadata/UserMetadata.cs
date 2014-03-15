namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class UserMetadata
    {
        [Display(Name = "Email")]
        public object Email { get; set; }

        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "First Name")]
        public object FirstName { get; set; }
    
        [Display(Name = "Middle Name")]
        public object MiddleName { get; set; }
    
        [Display(Name = "Last Name")]
        public object LastName { get; set; }

        [Display(Name = "User Account Type")]
        public object UserAccountTypeId { get; set; }

        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }
    
        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }
    
        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
