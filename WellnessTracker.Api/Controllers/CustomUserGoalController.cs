using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WellnessTracker.Api.Models;

namespace WellnessTracker.Api.Controllers
{
    public class CustomUserGoalController : ApiController
    {
        private GoalContext db = new GoalContext();

        public IEnumerable<CustomUserGoal> GetCustomUserGoals(string email)
        {
            return db.CustomUserGoals.Where(x => x.UserEmail == email.ToLower().Trim());
        }

        // POST api/CustomUserGoal
        public HttpResponseMessage PostCustomUserGoal(CustomUserGoal customusergoal)
        {
            if (ModelState.IsValid)
            {
                db.CustomUserGoals.Add(customusergoal);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, customusergoal);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = customusergoal.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}