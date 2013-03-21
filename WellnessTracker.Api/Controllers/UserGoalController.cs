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
    public class UserGoalController : ApiController
    {
        private GoalContext db = new GoalContext();

        // GET api/UserGoal?
        public IEnumerable<UserGoal> GetUserGoals(string email)
        {
            return db.UserGoals.Where(x => x.UserEmail == email.ToLower().Trim());
        }

        // POST api/UserGoal
        public HttpResponseMessage PostUserGoal(UserGoal usergoal)
        {
            if (ModelState.IsValid)
            {
                db.UserGoals.Add(usergoal);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, usergoal);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = usergoal.Id }));
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