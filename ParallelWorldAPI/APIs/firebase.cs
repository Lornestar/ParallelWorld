using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using Newtonsoft.Json.Linq;

namespace ParallelWorldAPI.APIs
{
    public class Firebase
    {
        char chr34 = Convert.ToChar(34);
        string baseendpoint = "https://lornestar.firebaseio.com/parallelworld/";

        /*public void UpdateMarket(Hashtable hstemp)
        {

            string strurl = "https://lornestar.firebaseio.com/arbitrage/.json";

            Web_Request(strurl, hstemp, 0);

        }

        public void UpdatePaths(Models.Path thepath)
        {
            string strurl = "https://lornestar.firebaseio.com/arbitrage/.json";

            Hashtable hstemp = new Hashtable();
            hstemp.Add(thepath.pathkey, Getpathhstable(thepath));

            Web_Request(strurl, hstemp, 0);

        }

        public void UpdateAllPaths(List<Models.Path> allthepaths)
        {
            string strurl = "https://lornestar.firebaseio.com/arbitrage/.json";

            Hashtable hstemp = new Hashtable();

            foreach (Models.Path thepath in allthepaths)
            {
                hstemp.Add(thepath.pathkey, Getpathhstable(thepath));
            }

            Web_Request(strurl, hstemp, 0);

        }

        protected Hashtable Getpathhstable(Models.Path thepath)
        {

            Hashtable hstemp = new Hashtable();
            hstemp.Add("percentage", Math.Round(thepath.marketdifference.percentage, 2));
            hstemp.Add("feeBTC", thepath.marketdifference.staticfeeBTC);
            hstemp.Add("feeLTC", thepath.marketdifference.staticfeeLTC);
            hstemp.Add("feeUSD", thepath.marketdifference.staticfeeUSD);
            hstemp.Add("time", thepath.marketdifference.time);

            Hashtable hstemp2 = new Hashtable();
            hstemp2.Add("pathkey", thepath.pathkey);
            hstemp2.Add("name", thepath.label);
            hstemp2.Add("marketdifference", hstemp);
            hstemp2.Add("lastupdated", DateTime.UtcNow.ToString("hh:mm:ss"));
            hstemp2.Add("volume", string.Format("{0:n0}", thepath.volume));

            return hstemp2;

        }*/

        public JArray Gettournamentevents(int tournamentid)
        {
            DataTable dttemp = new DataTable();

            string strresponse = Web_Request(baseendpoint + tournamentid.ToString() + "/events/.json", null, 0);

            if (strresponse == "null")
            {
                Hashtable hstemp2 = new Hashtable();
                hstemp2.Add("description", "This is the first event");
                Hashtable hstemp = new Hashtable();
                hstemp.Add(0, hstemp2);
                Web_Request(baseendpoint + tournamentid.ToString() + "/events/.json", hstemp, 1);
                strresponse = Web_Request(baseendpoint + tournamentid.ToString() + "/events/.json", null, 0);
            }

            JArray ja = JArray.Parse(strresponse);

            return ja;
        }

        public void AddTransaction(int tournamentid, string oldowner, string newowner, int itemid, decimal price, string txhash)
        {
            string description = newowner + " just bought a team for " + price.ToString() + " ETH.";

            Hashtable hstemp2 = new Hashtable();
            hstemp2.Add("itemid", itemid);
            hstemp2.Add("newowner", newowner);
            hstemp2.Add("oldowner", oldowner);
            hstemp2.Add("description", description);
            hstemp2.Add("price", price);
            hstemp2.Add("txhash", txhash);

            int eventnumber = 0;
            string strresponse = Web_Request(baseendpoint + tournamentid.ToString() + "/events/.json", null, 0);
            if (strresponse.Length > 0)
            {
                JArray ja = JArray.Parse(strresponse);
                eventnumber = ja.Count;
            }

            Hashtable hstemp = new Hashtable();
            hstemp.Add(eventnumber, hstemp2);

            Web_Request(baseendpoint + tournamentid.ToString() + "/events/.json", hstemp, 1);
        }

        public Models.Account GetAccount(string ethaddress)
        {
            Models.Account currentaccount = new Models.Account();
            currentaccount.ethaddress = ethaddress;

            string strresponse = Web_Request(baseendpoint + "/accounts/" + ethaddress + "/.json", null, 0);

            if (strresponse != "null")
            {
                JObject o = JObject.Parse(strresponse);
                if (o["email"]!= null)
                {
                    currentaccount.email = (string)o["email"];
                    currentaccount.nickname = (string)o["nickname"];
                }

            }


            return currentaccount;
        }

        public void UpdateAccount(string ethaddress, string nickname, string email)
        {
            Hashtable hstemp2 = new Hashtable();
            hstemp2.Add("email", email);
            hstemp2.Add("nickname", nickname);
            hstemp2.Add("ethaddress", ethaddress);
            Hashtable hstemp = new Hashtable();
            hstemp.Add(ethaddress, hstemp2);

            Web_Request(baseendpoint + "/accounts/.json", hstemp, 1);
        }


        public void ClearAllData()
        {
            string strurl = "https://lornestar.firebaseio.com/arbitrage/.json";

            Web_Request(strurl, null, 1);
        }

        private string Web_Request(string url, Hashtable hstemp, int method)
        {

            HttpWebResponse webResponse;

            // Create request object
            HttpWebRequest webRequest = WebRequest.Create(url) as HttpWebRequest;
            webRequest.ContentType = "application/json";
            if (method == 0) //read data
            {
                webRequest.Method = "GET";
            }
            if (method == 1) //edit data
            {
                webRequest.Method = "PATCH";
            }
            else if (method == 2) //delete data
            {
                webRequest.Method = "DELETE";
            }

            string jsontxt = "";
            if (hstemp != null)
            {
                jsontxt = JsonConvert.SerializeObject(hstemp);
            }

            if (method > 0)
            {
                // Write the request string to the request object
                StreamWriter writer = new StreamWriter(webRequest.GetRequestStream());

                writer.Write(jsontxt);
                writer.Close();

            }

            string responseString = "";
            try
            {
                // Get the response from the request object and verify the status
                webResponse = webRequest.GetResponse() as HttpWebResponse;
                if (!webRequest.HaveResponse)
                {
                    throw new Exception();
                }
                if (webResponse.StatusCode != HttpStatusCode.OK && webResponse.StatusCode != HttpStatusCode.Accepted)
                {
                    throw new Exception();
                }

                // Read the response string
                StreamReader reader = new StreamReader(webResponse.GetResponseStream());
                responseString = reader.ReadToEnd();
                reader.Close();
            }
            catch (Exception e)
            {
            }

            return responseString;
        }
    }
}