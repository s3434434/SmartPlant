﻿using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Plant
{
    public class AddPlantDto
    {
        //name of the plant chosen by the user e.g. COMPANY NAME - LOC - FLOOR 2 - MEETING ROOM 1
        [MaxLength(250)]
        public string PlantName { get; set; }
    }
}
