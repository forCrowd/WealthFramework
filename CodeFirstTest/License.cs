using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CodeFirstTest
{
    public class License
    {
        [Display(Name="Id",ShortName="Id")]
        [ScaffoldColumn(false)]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}