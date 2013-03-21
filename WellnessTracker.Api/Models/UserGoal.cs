using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class UserGoal
    {
        public int Id { get; set; }
        public string UserEmail { get; set; }
        public int CategoryId { get; set; }
        public int ItemId { get; set; }
        public int UnitId { get; set; }
        public int Value { get; set; }
    }
}