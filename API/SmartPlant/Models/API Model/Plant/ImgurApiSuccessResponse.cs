using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Razor.Compilation;

namespace SmartPlant.Models.API_Model.Plant
{
    public class ImgurApiSuccessResponse
    {
        public ImgurResponseData Data { get; set; }
        public bool success { get; set; }
        public int status { get; set; }

    }

    public class ImgurResponseData
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public int datetime { get; set; }
        public string type { get; set; }
        public bool animated { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int size { get; set; }
        public int views { get; set; }
        public int bandwidth { get; set; }
        public string vote { get; set; }
        public bool favorite { get; set; }
        public string nsfw { get; set; }
        public string section { get; set; }
        public string account_url { get; set; }
        public int account_id { get; set; }
        public bool is_ad { get; set; }
        public bool in_most_viral { get; set; }
        public string[] tags { get; set; }
        public int ad_type { get; set; }
        public string ad_url { get; set; }
        public bool in_gallery { get; set; }
        public string deletehash { get; set; }
        public string name { get; set; }
        public string link { get; set; }

    }
}
