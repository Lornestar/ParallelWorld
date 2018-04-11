using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http.Cors;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ParallelWorldAPI.Controllers
{
    [Route("api/account")]

    public class AccountController : Controller
    {
        // GET: /<controller>/
        [HttpGet("{ethaddress}")]
        public Models.Account GetAccount(string ethaddress)
        {
            string response = "";
            APIs.Firebase fb = new APIs.Firebase();
            Models.Account currentaccount = fb.GetAccount(ethaddress);

            //response = @" {'ethaddress':'"+ ethaddress + "','nickname':'" + currentaccount.nickname + "','email':'" + currentaccount.email + "'}";

            return currentaccount;
        }

        // POST api/values
        [HttpPost(Name = nameof(UpdateAccount))]
        public IActionResult UpdateAccount([FromBody]Models.Account account)
        {
            string email = account.email;
            string ethaddress = account.ethaddress;
            string nickname = account.nickname;

            APIs.Firebase fb = new APIs.Firebase();
            fb.UpdateAccount(ethaddress, nickname, email);

            APIs.sendgridapi sg = new APIs.sendgridapi();
            sg.Send_Welcome(account);

            return Ok("Updated");
        }
    }

}
