using Microsoft.AspNetCore.Identity;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartPlant.Models.Repository
{
    public interface IAccountManager
    {
        Task<RegistrationResponseDto> Register(ApplicationUser user, UserRegistrationDto userRegDto);
        Task<IdentityResult> ConfirmEmail(ApplicationUser user, string token);
        Task<AuthResponseDto> Login(UserForAuthenticationDto loginUser);
        Task<IEnumerable<string>> ForgotPassword(ForgotPasswordDto passwordDto);
        Task<IdentityResult> ResetPassword(ResetPasswordDto passwordDto);
        Task<UserDetailsDto> GetDetails(string userID);
        Task<IdentityResult> UpdateDetails(string userID, UpdateUserDetailsDto details);
        Task<IdentityResult> UpdateEmail(string userID, UpdateEmailDto emailDto);
        Task<IdentityResult> UpdatePassword(string userID, UpdatePasswordDto passwordDto);
        Task<bool> ContactSupport(string userID, SupportEmailDto dto);
        Task<string> GetCurrentUserRole(string userID);
        Task<List<AdminGetAllUsersDto>> AdminGetAllUsers();
        Task<UserDetailsDto> AdminGetUserDetails(string userID);
        Task<AdminUpdateUserDetailsDto> AdminUpdateUserDetails(AdminUpdateUserDetailsDto detailsDto);
        Task<List<AdminGetRoleListDto>> AdminGetRoleList();
        Task<AdminUpdateUserRoleDto> AdminUpdateRole(AdminUpdateUserRoleDto detailsDto);
        Task<IdentityResult> AdminUpdatePassword(AdminUpdatePasswordDto passwordDto);
        Task<IdentityResult> AdminDeleteUser(ApplicationUser user);

    }
}
