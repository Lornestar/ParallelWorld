using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ParallelWorldAPI.Controllers
{
    [Route("api/transaction")]
    public class TransactionController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        // POST api/values
        [HttpPost(Name = nameof(UpdateTransaction))]
        public IActionResult UpdateTransaction([FromBody]int itemid, int tournamentid, decimal pricepaid, string oldowner, string newowner)
        {
            var testitemid = itemid;
            return "";
        }
    }
}
