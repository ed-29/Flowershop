import React, { useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    background: "/elegant.jpg",
    heading: "Elegant Floral Arrangements",
    subheading: "Luxury bouquets crafted to perfection",
  },
  {
    id: 2,
    background: "/wedding.jpg",
    heading: "Bespoke Wedding Flowers",
    subheading: "Make your day unforgettable",
  },
  {
    id: 3,
    background: "/seasonal.jpg",
    heading: "Seasonal Collections",
    subheading: "Freshly curated with love and color",
  },
];

const Hero = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const nextScroll =
          container.scrollLeft + container.clientWidth >= container.scrollWidth
            ? 0
            : container.scrollLeft + container.clientWidth;

        container.scrollTo({
          left: nextScroll,
          behavior: "smooth",
        });
      }
    }, 4000); // scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={scrollRef}
      className="flex overflow-x-auto scroll-smooth w-full h-screen snap-x snap-mandatory no-scrollbar"
    >
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="w-full flex-shrink-0 h-screen relative snap-start"
          style={{
            backgroundImage: `url(${slide.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0  bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">{slide.heading}</h1>
            <p className="text-white text-lg md:text-2xl">{slide.subheading}</p>
            
          </div>
        </div>
      ))}
    </section>
  );
};

export default Hero;
