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
    public class GoalCategoryController : ApiController
    {
        private GoalContext db = new GoalContext();

        // GET api/GoalCategory
        public IEnumerable<GoalCategory> GetGoalCategories()
        {
            return db.GoalCategories.AsEnumerable();
        }

        // GET api/GoalCategory/5
        public GoalCategory GetGoalCategory(int id)
        {
            GoalCategory goalcategory = db.GoalCategories.Find(id);
            if (goalcategory == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return goalcategory;
        }

        // PUT api/GoalCategory/5
        //public HttpResponseMessage PutGoalCategory(int id, GoalCategory goalcategory)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }

        //    if (id != goalcategory.GoalCategoryId)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.BadRequest);
        //    }

        //    db.Entry(goalcategory).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK);
        //}

        // POST api/GoalCategory
        //public HttpResponseMessage PostGoalCategory(GoalCategory goalcategory)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.GoalCategories.Add(goalcategory);
        //        db.SaveChanges();

        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, goalcategory);
        //        response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = goalcategory.GoalCategoryId }));
        //        return response;
        //    }
        //    else
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }
        //}

        // DELETE api/GoalCategory/5
        //public HttpResponseMessage DeleteGoalCategory(int id)
        //{
        //    GoalCategory goalcategory = db.GoalCategories.Find(id);
        //    if (goalcategory == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    db.GoalCategories.Remove(goalcategory);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK, goalcategory);
        //}

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}