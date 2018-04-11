using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Newtonsoft.Json.Linq;

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
        public async Task<IActionResult> UpdateTransaction([FromBody]Models.Transaction tx)
        {
            //check if API called already with tx
           

            //bool checkapicall = Startup.txapicalls.All(transaction => ((transaction.pricepaid == tx.pricepaid) && (transaction.itemid == tx.itemid)));

            if (!transactionhasbeencalledbefore(tx))
            {
                //get latest price of the itemid
               APIs.Firebase fb = new APIs.Firebase();
                /* JArray ja = fb.Gettournamentevents(0);
                 

                //loop through and find highest price
                decimal highestprice = 0;
                foreach (var o in ja)
                {
                    try
                    {
                        JObject o2 = (JObject)o;
                        if ((o2["price"] != null) && (o2["itemid"] != null))
                        {
                            //check if correct itemid
                            int currentitemid = (int)o2["itemid"];
                            decimal currentprice = (decimal)o2["price"];
                            if (currentitemid == tx.itemid)
                            {
                                //same itemid
                                if (currentprice > highestprice)
                                {
                                    highestprice = currentprice;
                                }
                            }
                        }
                    }
                    catch
                    {

                    }
                }*/

                //get current price amount of itemid from smart contract
                decimal currentpricecontract = 0;
                APIs.ethereumapi eth = new APIs.ethereumapi();
                currentpricecontract = await eth.Getitemcurrentprice(tx.itemid);

                //if latest price is lower than price paid, then update & send notification email

                //add transaction to events list on firebase
                fb.AddTransaction(tx.tournamentid, tx.oldowner, tx.newowner, tx.itemid, tx.pricepaid, tx.txhash);

                //send old owner an email
                APIs.sendgridapi sg = new APIs.sendgridapi();
                Models.Account currentaccount = fb.GetAccount(tx.oldowner);
                sg.Send_Transaction_Old_Owner(currentaccount, tx);

                //send new owner an email
                currentaccount = fb.GetAccount(tx.newowner);
                sg.Send_Transaction_New_Owner(currentaccount, tx);

            }
            return Ok("Updating");
        }

        private bool transactionhasbeencalledbefore(Models.Transaction tx)
        {
            bool hasbeencalled = false;

            hasbeencalled = Startup.txapicalls.Contains(tx.txhash);
            if (hasbeencalled ==false)
            {
                Startup.txapicalls.Add(tx.txhash);
            }

            return hasbeencalled;
        }
    }
}
