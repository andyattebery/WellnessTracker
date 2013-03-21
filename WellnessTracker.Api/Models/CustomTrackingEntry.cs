using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class CustomTrackingEntry
    {
        public User User { get; set; }
        public CustomUserGoal CustomGoal { get; set; }
    }
}