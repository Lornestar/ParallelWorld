using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ParallelWorldAPI
{
    public class Startup
    {
        public static List<string> _txapicalls;
        public static List<string> txapicalls
        {
            get { return _txapicalls; }
            private set { }
        }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddCors();

            _txapicalls = new List<string>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

           
            app.UseCors(
                options => options.WithOrigins("https://www.parallelworldcup.com").AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader()
            );
            app.UseCors(
                options => options.WithOrigins("https://www.oneowneronewinner.com").AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader()
            );
            app.UseCors(
                options => options.WithOrigins("http://localhost:3004").AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader()
            );

            app.UseMvc();

        }
    }
}
