using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class CustomUserGoal
    {
        public int Id { get; set; }
        public string UserEmail { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public int Value { get; set; }
    }
}