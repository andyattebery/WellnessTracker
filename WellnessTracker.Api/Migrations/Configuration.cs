using System.Collections.Generic;
using WellnessTracker.Api.Models;

namespace WellnessTracker.Api.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WellnessTracker.Api.Models.GoalContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(WellnessTracker.Api.Models.GoalContext context)
        {
            var fitnessItems = new List<Item>()
                {
                    new Item()
                };

            context.GoalCategories.AddOrUpdate(
                gc => gc.Id,
                new GoalCategory(0, "Fitness"),
                new GoalCategory(1, "Nutrition"),
                new GoalCategory(2, "Rest and Wellness")
                );



            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
