using System;
namespace ParallelWorldAPI.Models
{
    public class Transaction
    {
        public int itemid { get; set; }
        public int tournamentid { get; set; }
        public decimal pricepaid { get; set; }
        public string oldowner { get; set; }
        public string newowner { get; set; }
        public string txhash { get; set; }


        public Transaction()
        {
        }
    }
}
