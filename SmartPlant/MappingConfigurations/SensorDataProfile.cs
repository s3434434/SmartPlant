using AutoMapper;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;

namespace SmartPlant.MappingConfigurations
{
    public class SensorDataProfile : Profile
    {
        public SensorDataProfile()
        {
            //map from the dto/API Model to the domain object 
            //SensorDataModel to SensorData
            CreateMap<SensorDataModel, SensorData>();
        }

    }
}
