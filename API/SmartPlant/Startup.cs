using EmailService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SmartPlant.Data;
using SmartPlant.JwtFeatures;
using SmartPlant.Models;
using SmartPlant.Models.DataManager;
using SmartPlant.Models.Repository;
using System.IO;
using System.Text;

namespace SmartPlant
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DatabaseContext>(options =>
            {
                //options.UseSqlServer(Configuration.GetConnectionString("LocalDataBase"));
                //options.UseSqlServer(Configuration.GetConnectionString("LiveDataBase"));
                options.UseSqlServer(Configuration.GetConnectionString("DataBase"));

                // Enable lazy loading.
                //options.UseLazyLoadingProxies();
            });

            //email service
            var emailConfig = Configuration.GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);
            services.AddScoped<IEmailSender, EmailSender>();

            //automapper
            services.AddAutoMapper(typeof(Startup));

            //identity
            services.AddIdentity<ApplicationUser, IdentityRole>(o =>
               {    //password requirements
                   o.Password.RequireDigit = false;
                   o.Password.RequireLowercase = false;
                   o.Password.RequireUppercase = false;
                   o.Password.RequireNonAlphanumeric = false;
                   o.Password.RequiredLength = 3;
                   o.User.RequireUniqueEmail = true;
                   o.SignIn.RequireConfirmedEmail = true;
               }
                )
                .AddEntityFrameworkStores<DatabaseContext>()
                .AddDefaultTokenProviders();

            //JWT token 
            var jwtSettings = Configuration.GetSection("JwtSettings");
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.GetSection("validIssuer").Value,
                    ValidAudience = jwtSettings.GetSection("validAudience").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.GetSection("securityKey").Value))
                };
            });
            services.AddScoped<JwtHandler>();

            //add DataManager Services
            services.AddScoped<IPlantManager, PlantManager>();
            services.AddScoped<ISensorDataManager, SensorDataManager>();
            services.AddScoped<IAccountManager, AccountManager>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartPlant", Version = "v1" });

                //xml documentation
                var filePath = Path.Combine(System.AppContext.BaseDirectory, "SmartPlant.xml");
                c.IncludeXmlComments(filePath);

                //authorization in swagger ui
                c.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
                {
                    Description = "`Token only` - without `\"\"`",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Scheme = "bearer"
                });
                c.AddSecurityDefinition("plant token", new OpenApiSecurityScheme
                {
                    Description = "To be used with creating SensorData [Post]",
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Header,
                    Scheme = "basic"
                });
                c.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "bearer"
                                }
                            },
                            new string[] { }
                        }
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /*if (env.IsDevelopment())
            {*/
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartPlant v1"));
            //}

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
