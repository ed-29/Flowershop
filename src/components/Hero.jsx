import React from "react";

const Hero = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-[url('/hero.jpg')] bg-cover bg-top px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center">
        <img src="./logo.svg" alt="FloweShop Logo" className="w-48 h-48 mb-8" />
        <p className="text-lg md:text-2xl text-white text-center max-w-2xl">
          Discover beautiful floral arrangements for every occasion. From elegant bouquets to bespoke wedding flowers, we craft perfection with every petal.
        </p>
      </div>
    </section>
  );
};

export default Hero;
