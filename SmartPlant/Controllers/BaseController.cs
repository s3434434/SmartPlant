using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    public abstract class BaseController : Controller
    {
        //not needed?
        //just use User.Identity.Name
        protected virtual string GetUserID()
        {
            var uid = ((ClaimsIdentity)User.Identity).Claims
                     .Where(c => c.Type == ClaimTypes.Name)
                     .Select(c => c.Value).ToList();

            if (uid.Count > 0)
                return uid[0];

            else return null;
        }
}
}
