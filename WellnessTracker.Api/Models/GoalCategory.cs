using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WellnessTracker.Api.Models
{
    public class GoalCategory
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual IList<Item> Items { get; set; }

        public GoalCategory()
        {
            Name = string.Empty;
        }

        public GoalCategory(int id,  string name)
        {
            Id = id;
            Name = name;
        }

        public GoalCategory(int id, string name, IList<Item> items)
        {
            Id = id;
            Name = name;
            Items = items;
        }
    }
}