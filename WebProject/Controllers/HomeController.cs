using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebProject.Models;

namespace WebProject.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public string FetchData()
        {
            List<Master> masters = new List<Master>();
            string cs = ConfigurationManager.ConnectionStrings["dbcs"].ConnectionString;

            using(SqlConnection con =  new SqlConnection(cs))
            {
                string procedure = "FetchData";
                using (SqlCommand cmd = new SqlCommand(procedure, con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    con.Open();

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Master master = new Master()
                        {
                            Name = reader["Name"].ToString(),
                            Designation = reader["Designation"].ToString()
                        };
                        masters.Add(master);
                    }
                }
            }
            string json = JsonConvert.SerializeObject(masters);
            return json;
        }

        public ActionResult Display()
        {
            List<Master> master = new List<Master>();
            return View();
        }
    }
}