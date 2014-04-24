using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Web.CodeFirst
{
    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public License License { get; set; }
    }
}