using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class TrackingEntry
    {
        public User User { get; set; }
        public UserGoal Goal { get; set; }

        
    }
}