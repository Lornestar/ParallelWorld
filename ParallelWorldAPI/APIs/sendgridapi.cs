using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;
using System.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SendGrid;
using SendGrid.SmtpApi;
using SendGrid.Helpers.Mail;
using System.Net;
using System.Threading.Tasks;

namespace ParallelWorldAPI.APIs
{
    public class sendgridapi
    {
        public sendgridapi()
        {
        }
        static string strFrom = "noreply@ParallelSports.com";
        static string strFromName = "noreply";

        public async Task SimpleEmail(string strTo, string strToEmail, string templateid, Hashtable hstemp, string subject)
        {
            try
            {
                // From

                /*
                var myMessage = new SendGridMessage()
                {
                    From = new EmailAddress(strFrom, strFromName),
                    Subject = subject,
                    PlainTextContent = " ",
                    HtmlContent = " "
                };

                foreach (DictionaryEntry entry in hstemp)
                {
                    List<string> templist = new List<string>();
                    templist.Add(entry.Value.ToString());
                    myMessage.AddSubstitution(entry.Key.ToString(), templist.ToString());
                }

                //Filters
                var filters = new Dictionary<string, dynamic>()
                {
                    {
                        "opentrack", new Dictionary<string, dynamic>()
                        {
                            {
                                "settings", new Dictionary<string, dynamic>()
                                {
                                    {
                                        "enable", 1
                                    }
                                }
                            }
                        }
                    },
                    {
                        "templates", new Dictionary<string, dynamic>()
                        {
                            {
                                "settings", new Dictionary<string, dynamic>()
                                {
                                    {
                                        "enable", 1
                                    },
                                    {
                                        "template_id", templateid
                                    }
                                }
                            }
                        }
                    }
                };
               /* foreach (var filter in filters.Keys)
                {
                    var settings = filters[filter]["settings"];
                    foreach (var setting in settings.Keys)
                    {
                        myMessage.AddHeader(filter, new List<string> { setting }, Convert.ToString(settings[setting]));
                    }
                }*/

                /* CREDENTIALS
                 * ===================================================*/


                /* SEND THE MESSAGE
                 * ===================================================*/
                /*var credentials2 = new NetworkCredential(sgUsername, sgPassword);
                // Create a Web transport for sending email.
                var transportWeb = new Web(credentials2);

                // Send the email.
                transportWeb.Deliver(myMessage);*/

                if (strToEmail.Length > 0)
                {
                    var msg = new SendGridMessage();
                    msg.SetFrom(new EmailAddress("noreply@parallelworldsport.com", "Parallel World Sports"));
                    msg.SetSubject(subject);
                    msg.AddTo(new EmailAddress(strToEmail, strTo));
                    //msg.AddContent(MimeType.Text, "I'm replacing the <strong>body tag</strong>");
                    msg.SetTemplateId(templateid);

                    foreach (DictionaryEntry entry in hstemp)
                    {
                        //List<string> templist = new List<string>();
                        //templist.Add(entry.Value.ToString());
                        msg.AddSubstitution(entry.Key.ToString(), entry.Value.ToString());
                    }

                    var client = new SendGridClient("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");
                    var response = await client.SendEmailAsync(msg);

                    Console.WriteLine(response.StatusCode);
                    Console.WriteLine(response.Headers.ToString());
                    Console.WriteLine("\n\nPress any key to exit.");
                    Console.ReadLine();
                }



            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }

        protected string Get_Template_Info(string to, string templateid, Hashtable hssubs)
        {
            string strtemplate = "";

            string sub = "";
            foreach (DictionaryEntry entry in hssubs)
            {
                if (sub.Length > 0)
                {
                    sub += ",";
                }
                sub += "\":" + entry.Key + "\":[\"" + entry.Value + "\"]";
            }


            Hashtable hstemplates = new Hashtable();
            Hashtable hssettings = new Hashtable();

            hssettings.Add("enable", 1);
            hssettings.Add("template_id", templateid);
            hstemplates.Add("settings", hssettings);

            strtemplate = "{\"to\":[\"" + to + "\"],\"sub\":{" + sub + "},\"filters\":{\"templates\":" + JsonConvert.SerializeObject(hstemplates) + "}}";


            return strtemplate;

        }

        public void Send_Welcome(Models.Account currentaccount)
        {
            Hashtable hstemp = new Hashtable();
            if (currentaccount.nickname.Length > 0)
            {
                hstemp.Add("NICKNAME", currentaccount.nickname);
            }
            else{
                hstemp.Add("NICKNAME", currentaccount.ethaddress);
            }


            SimpleEmail("", currentaccount.email, "e37d5406-a615-4dbd-b351-76676fd0945a", hstemp, "Welcome to ParallelWorld");

        }


        public void Send_Transaction_Old_Owner(Models.Account currentaccount, Models.Transaction currenttx)
        {
            Hashtable hstemp = new Hashtable();
            if (currentaccount.nickname.Length > 0)
            {
                hstemp.Add("NICKNAME", currentaccount.nickname);
            }
            else
            {
                hstemp.Add("NICKNAME", currentaccount.ethaddress);
            }

            SimpleEmail("", currentaccount.email, "3c7917a3-be51-40c9-a1b9-47dbb876473e", hstemp, "ParallelWorld team purchased");
        }

        public void Send_Transaction_New_Owner(Models.Account currentaccount, Models.Transaction currenttx)
        {
            Hashtable hstemp = new Hashtable();
            if (currentaccount.nickname.Length > 0)
            {
                hstemp.Add("NICKNAME", currentaccount.nickname);
            }
            else
            {
                hstemp.Add("NICKNAME", currentaccount.ethaddress);
            }

            SimpleEmail("", currentaccount.email, "6198ab93-5cbf-46ee-9ab2-8f6ff7f4e7bd", hstemp, "ParallelWorld team purchased");
        }

    }
}
