import React from "react";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Vêtements",
      image: "/home/vet.png",
    },
    {
      id: 2,
      title: "Parfums",
      image: "/home/parf.png",
    },
    {
      id: 3,
      title: "Accessoires",
      image: "/home/acc.png",
    },
  ];

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-36 py-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 ">
        Our Features
      </h2>
      <p className="text-center text-xl py-8 text-black">
        Own Your Style. Live Hashseven.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white  p-6 text-center  transition-shadow duration-300 flex flex-col "
          >
            <div className="flex justify-center items-center mb-4 flex-1 bordered border-black border">
              <img
                src={feature.image}
                alt={feature.title}
                className="object-contain"
              />
            </div>
            <div className="min-h-[60px] flex items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
