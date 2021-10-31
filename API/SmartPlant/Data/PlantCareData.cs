using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Web;
using MimeKit;
using SmartPlant.Models.API_Model;

namespace SmartPlant.Data
{
    public struct PlantCareData
    {
        /*The double array represents - Light, Temperature, Humidity, Moister
         *
         * Light:
         *
         *      1 - Sunny light areas: At least 4 hours of direct sun           80%+
         *      2 - High-light areas: Over 200 ft-c, but not direct sun         60-80%
         *      3 - Medium-light areas: 75 ft-c to 200 ft-c                     40-60%
         *      4 - Low-light areas: 25 ft-c to 75 ft-c                         20-40%
         *  
         * Temperature:
         *
         *      1 - Cool: 10°C night, 18°C day temperatures
         *      2 - Average: 18°C night, 24°C day temperatures
         *      3 - Warm: 21°C night, 30°C day temperatures
         *
         * Humidity:
         * 
         *      1 - High: 50% or higher
         *      2 - Average: 25% to 49%
         *      3 - Low: 5% to 24%
         *
         * Moisture:
         *        
         *      1 - Keep soil mix moist                                     >60%
         *      2 - Surface of soil mix should dry before re-watering       40-60%
         *      3 - Soil mix can become moderately dry before re-watering   20-50%
         *
         */
        public static readonly Dictionary<string, double[]> PlantCareDict =
            new Dictionary<string, double[]>()
        {
            {
                "Other", new double[]{0, 0, 0, 0}
            },
            {
                "Flowering Maple", new double[]{1, 1, 2, 4}
            },
            {
                "Chenile Plant", new double[]{1, 2, 2, 2}
            },
            {
                "Sweet Flag", new double[]{3, 2, 1,2}
            },
            {
                "Maidenhair Fern", new double[]{3,2,1,1}
            },
            {
                "Crinkle-Leaf Plant", new double[]{3,2,1,2}
            },
            {
                "Plover Eggs", new double[]{3,2,2,2}
            },
            {
                "Silver Vase", new double[]{3,2,2,2}
            },
            {
                "Variegated Century Plant", new double[]{1,2,3,3}
            },
            {
                "Chinese Evergreen", new double[]{4,2,2,2}
            },
            {
                "Silver King", new double[]{4,2,2,2}
            },
            {
                "Silver Queen", new double[]{4,2,2,2}
            },
            {
                "Fiddle-Leaf Fig", new double[]{2,2,2,2}
            },
            {
                "Spider Plant", new double[]{3,2,2,1}
            },
            {
                "Peace Lily", new double[]{3,2,2,1}
            },
            {
                "Baby Tears", new double[]{3,2,2,1}
            },
            {
                "Aloe Vera", new double[]{1,3,3,3}
            },
            {
                "Jade Plant", new double[]{3,2,2,2}
            },
            {
                "Rattlesnake Plant", new double[]{2,2,2,1}
            },
            {
                "Bromeliad", new double[]{3,2,2,1}
            },
            {
                "Bamboo Palm", new double[]{2,2,2,2}
            },
            {
                "English Ivy ", new double[]{2,1,2,2}
            },
            {
                "Spotted Dumb Cane", new double[]{3,2,2,2}
            },
            {
                "Rose Calathea", new double[]{3,2,2,1}
            },
            {
                "Goldfish Plant", new double[]{2,2,2,1}
            },
            {
                "Croton", new double[]{1,2,1,1}
            },
            {
                "Heart-Leaf Philodendron", new double[]{3,2,2,2}
            },
            {
                "Fiddle-Leaf Philodendron", new double[]{3,2,2,2}
            },
            {
                "Waffle Plant", new double[]{2,2,2,2}
            },
            {
                "Crown-of-Thorns", new double[]{1,2,3,3}
            },
            {
                "Japanese Aralia", new double[]{3,2,2,2}
            },
            {
                "Candle Plant", new double[]{2,2,2,2}
            },
            {
                "African Violets", new double[]{2,2,2,1}
            },
            {
                "Cape Primrose", new double[]{2,2,2,2}
            },
            {
                "Hyacinth", new double[]{2,1,2,1}
            },
            {
                "Fluffy Ruffles", new double[]{2,2,1,2}
            },
            {
                "Ladyslipper Orchids", new double[]{2,2,2,2}
            },
            {
                "Yellow Shrimp Plant", new double[]{2,2,2,1}
            },
            {
                "Pearly Moonstones", new double[]{2,2,3,3}
            },
            {
                "House Geranium", new double[]{2,2,3,2}
            },
            {
                "Emerald Ripple", new double[]{3,2,2,2}
            },
            {
                "Baby Rubber Tree", new double[]{3,2,2,2}
            },
            {
                "Dancing Bulb", new double[]{2,2,2,2}
            },
            {
                "Zebra Plant", new double[]{2,2,2,2}
            }
        };

        public static GenericReturnMessageDto PlantCareCheck(string plantType, double light, double temp, double humidity, double moisture)
        {

            var baseLight = PlantCareDict[plantType][0];
            var baseTemp = PlantCareDict[plantType][1];
            var baseHumidity = PlantCareDict[plantType][2];
            var baseMoisture = PlantCareDict[plantType][3];



            var returnMessage = new GenericReturnMessageDto
            {
                Messages = new Dictionary<string, List<string>>
                {
                    {"Light", new List<string> {PlantCareLightCheck(baseLight, light)}},
                    {"Temperature", new List<string> {PlantCareTempCheck(baseTemp, temp)}},
                    {"Humidity", new List<string> {PlantCareHumidityCheck(baseHumidity, humidity)}},
                    {"Moisture", new List<string> {PlantCareMoistureCheck(baseMoisture, moisture)}}
                }
            };

            return returnMessage;
        }

        //helpers

        private static string PlantCareLightCheck(double baseLight, double light)
        {
            switch (baseLight)
            {
                case 1:
                    if (light < 70)
                    {
                        return "Light levels are too low";
                    }
                    else
                    {
                        return "Light levels are good";
                    }
                case 2:
                    if (light > 80)
                    {
                        return "Light levels are too high";
                    }

                    if (light < 60)
                    {
                        return "Light levels are too low";
                    }

                    return "Light levels are good";
                case 3:
                    if (light > 60)
                    {
                        return "Light levels are too high";
                    }
                    if (light < 40)
                    {
                        return "Light levels are too low";
                    }
                    return "Light levels are good";
                case 4:
                    if (light > 40)
                    {
                        return "Light levels are too high";
                    }
                    if (light < 20)
                    {
                        return "Light levels are too low";
                    }
                    return "Light levels are good";
                default:
                    return "";
            }
        }

        private static string PlantCareTempCheck(double baseTemp, double temp)
        {
            switch (baseTemp)
            {
                case 1:
                    if (temp > 18)
                    {
                        return "Temperature is too hot";
                    }
                    if (temp < 10)
                    {
                        return "Temperature is too cold";
                    }

                    return "Temperature is good";

                case 2:
                    if (temp > 24)
                    {
                        return "Temperature is too hot";
                    }
                    if (temp < 18)
                    {
                        return "Temperature is too cold";
                    }

                    return "Temperature is good";

                case 3:
                    if (temp > 30)
                    {
                        return "Temperature is too hot";
                    }
                    if (temp < 21)
                    {
                        return "Temperature is too cold";
                    }

                    return "Temperature is good";
                default:
                    return "";
            }
        }

        private static string PlantCareHumidityCheck(double baseHumidity, double humidity)
        {
            switch (baseHumidity)
            {
                case 1:
                    if (humidity < 50)
                    {
                        return "Humidity too low";
                    }

                    return "Humidity is good";

                case 2:
                    if (humidity > 50)
                    {
                        return "Humidity too high";
                    }
                    if (humidity < 25)
                    {
                        return "Humidity too low";
                    }
                    return "Humidity is good";

                case 3:
                    if (humidity > 24)
                    {
                        return "Humidity too high";
                    }
                    if (humidity < 5)
                    {
                        return "Humidity too low";
                    }
                    return "Humidity is good";
                default:
                    return "";
            }
        }

        private static string PlantCareMoistureCheck(double baseMoisture, double moisture)
        {
            switch (baseMoisture)
            {
                case 1:
                    if (moisture < 60)
                    {
                        return "Not enough moisture";
                    }

                    return "Moisture levels are good";

                case 2:
                    if (moisture > 60)
                    {
                        return "Too much moisture";
                    }
                    if (moisture < 40)
                    {
                        return "Not enough moisture";
                    }
                    return "Moisture levels are good";

                case 3:
                    if (moisture > 50)
                    {
                        return "Too much moisture";
                    }
                    if (moisture < 20)
                    {
                        return "Not enough moisture";
                    }
                    return "Moisture levels are good";
                default:
                    return "";
            }
        }
    }
}
