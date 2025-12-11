import React from "react";
import { Jersey_10 } from "next/font/google";

// Configuration de la police Jersey 10
const jersey = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

const Values = () => {
  return (
    <div>
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-36">
        <h1 className="text-5xl font-bold text-center py-4"> Our Values</h1>
        <div className="mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-8 self-start">
              <h1
                className={`text-5xl font-bold text-black text-center ${jersey.className}`}
              >
                Premium quality, selected fabrics, built to last.
              </h1>
            </div>
            <div className=" rounded-lg flex items-center justify-center">
              <img
                src="/home/values.png"
                alt="Our Values"
                className="rounded-sm"
              />
            </div>
            <div className="space-y-8 self-end">
              <h1
                className={`text-5xl font-bold text-black text-center ${jersey.className}`}
              >
                Authenticity 100% <br /> original designs{" "}
              </h1>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Values;
