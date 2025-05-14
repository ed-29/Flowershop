import React from "react";

const services = [
  {
    id: 1,
    icon: "💐",
    title: "Custom Bouquets",
    description: "Tailored floral arrangements for any occasion.",
  },
  {
    id: 2,
    icon: "🎉",
    title: "Event Decoration",
    description: "Floral styling for weddings, parties, and corporate events.",
  },
  {
    id: 3,
    icon: "🚚",
    title: "Same-Day Delivery",
    description: "Fast and reliable flower delivery service.",
  },
  {
    id: 4,
    icon: "🌸",
    title: "Seasonal Collections",
    description: "Fresh picks and unique designs for every season.",
  },
];

const Services = () => {
  return (
    <section id="OurServices" className="py-16 px-6 bg-pink-50">
      <div className="max-w-6xl mx-auto text-center">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
