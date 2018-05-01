using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ParallelWorldAPI.Controllers
{
    [Route("api/smartcontract")]
    public class SmartContractController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        // GET api/smartcontract/potsize
        [HttpGet("potsize")]
        public async Task<string> Get()
        {
            //read pot size from smartcontract
            APIs.ethereumapi eth = new APIs.ethereumapi();
            decimal potsize = await eth.Getcurrentpotsize();

            return potsize.ToString();
        }
    }
}
