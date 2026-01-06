import React from "react";
import houseImg from "../assets/why/why-img.png"; // replace with your image

export default function WhyChooseUs() {
  return (
    <section id="opportunities" className="w-full bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADING */}
        <div className="mb-12">
          <span className="text-xl dm font-bold text-blue-600 uppercase tracking-wide text-[#3334E3]">
            Why Choose Us
          </span>
          <h2 className="mt-3 dm font-medium text-[28px] md:text-[44px] leading-[1] text-black max-w-[618px]">
            The smart choice for profitable real estate investments
          </h2>
        </div>

        {/* MAIN CONTENT */}
        <div className=" grid grid-cols-1 gap-8 items-center lg:grid-cols-[28%_68%] ">
          
          {/* LEFT IMAGE */}
          <div className="w-full align-center justify-center flex">
            <img
              src={houseImg}
              alt="Luxury Property"
              className="rounded-[26px] w-[331px] h-auto object-cover"
            />
          </div>

          {/* RIGHT FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 dm">
            
            {/* ITEM 1 */}
            <div className="flex gap-2">
              <div className="flex-shrink-0 sm:w-16 sm:h-16 w-12 h-12 rounded-full border border-[#3334E3] flex items-center justify-center text-[#3334E3] font-semibold text-[44px] md:text-[28px]">
                1
              </div>
              <p className="text-[#000000] text-[16px] sm:text-[18px] leading-relaxed">
                <span className="font-semibold">Expert Market Insights</span> - We analyze the best locations and properties for high returns.
              </p>
            </div>

            {/* ITEM 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 sm:w-16 sm:h-16 w-12 h-12 rounded-full border border-[#3334E3] flex items-center justify-center text-[#3334E3] font-semibold text-[44px] md:text-[28px]">
                2
              </div>
              <p className="text-[#000000] text-[16px] sm:text-[18px] leading-relaxed">
                <span className="font-semibold">Hands-Free Investing</span> - Let us handle the research, acquisition, and management.
              </p>
            </div>

            {/* ITEM 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 sm:w-16 sm:h-16 w-12 h-12 rounded-full border border-[#3334E3] flex items-center justify-center text-[#3334E3] font-semibold text-[44px] md:text-[28px]">
                3
              </div>
              <p className="text-[#000000] text-[16px] sm:text-[18px] leading-relaxed">
                <span className="font-semibold">Diverse Portfolio Options</span> - From rental properties to commercial real estate, we offer profitable opportunities.
              </p>
            </div>

            {/* ITEM 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 sm:w-16 sm:h-16 w-12 h-12 rounded-full border border-[#3334E3] flex items-center justify-center text-[#3334E3] font-semibold text-[44px] md:text-[28px]">
                4
              </div>
              <p className="text-[#000000] text-[16px] sm:text-[18px] leading-relaxed">
                <span className="font-semibold">Proven Track Record</span> - Join a network of investors benefiting from stable, high-yield assets.
              </p>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-[#3334E3]  my-6 sm:my-8 md:my-16"></div>

        

        <div className="
          grid 
          grid-cols-1 
          gap-8 
          justify-center 
          text-center 
          sm:text-left 
          sm:grid-cols-2 
          lg:grid-cols-[24%_24%_44%] 
          mx-auto 
          max-w-7xl
        ">

          {/* 1st */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <span className="xl:text-[100px] lg:text-[90px] md:text-[80px] text-[50px] font-semibold text-black">
              10+
            </span>
            <p className="text-[#000000] font-medium font-dm text-[15px] md:text-[20px] lg:text-[24px]">
              Years of<br />experience
            </p>
          </div>

          {/* 2nd */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <span className="xl:text-[100px] lg:text-[90px] md:text-[80px] text-[50px]  font-semibold text-black">
              1K+
            </span>
            <p className="text-[#000000] font-dm font-medium  text-[15px] md:text-[20px] lg:text-[24px]">
              Managed<br />properties
            </p>
          </div>

          {/* 3rd — SINGLE ROW CENTER */}
          <div className="
            flex 
            items-center 
            gap-3 
            justify-center 
            sm:col-span-2 
            lg:col-span-1 
            mx-auto 
            lg:mx-0
          ">
            <span className="xl:text-[100px] lg:text-[90px] md:text-[80px] text-[50px] font-semibold text-black">
              $500M+
            </span>
            <p className="text-[#000000] font-medium font-dm text-[15px] md:text-[20px] lg:text-[24px]">
              Real estate<br />deals
            </p>
          </div>

        </div>


      </div>
    </section>
  );
}
