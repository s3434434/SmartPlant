using AutoMapper;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;

namespace SmartPlant.MappingConfigurations
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //map from the dto/API Model to the domain object 
            //SensorDataModel to SensorData
            CreateMap<SensorDataModel, SensorData>();

            CreateMap<AdminAddPlantDto, Plant>();

            //map from user reg dto to user model
            //assign username as the email - so user logs in with their email.
            CreateMap<UserRegistrationDto, ApplicationUser>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));

            CreateMap<UserDetailsDto, ApplicationUser>()
                 .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }

    }
}
