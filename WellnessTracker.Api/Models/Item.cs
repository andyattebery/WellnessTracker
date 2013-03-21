using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public virtual IList<Unit> Unit { get; set; } 
    }
}