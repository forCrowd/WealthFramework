namespace BusinessObjects.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class UserResourcePoolIndexDto
    {
        public decimal IndexShare { get; set; }
        public decimal IndexValueMultiplied { get; set; }
    }
}
