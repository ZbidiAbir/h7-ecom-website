import React from "react";

const Values = () => {
  return (
    <div>
      {" "}
      <section className="bg-black py-16 px-4 sm:px-6 lg:px-36">
        <div className=" mx-auto py-12">
          {/* Titre principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Colonne de droite - Image */}
            <div className="rounded-lg aspect-square flex items-center justify-center">
              <img src="/home/values.png" alt="Our Values" />
            </div>
            {/* Colonne de gauche - Texte */}
            <div className="space-y-8">
              {/* Phrase d'introduction */}
              <h1 className="text-5xl font-bold text-center">Our Values</h1>

              {/* Valeur Premium */}
              <div className="space-y-4 flex text-center justify-center pt-12">
                <div>
                  <img src="/home/prem.svg" alt="Premium" />
                </div>
              </div>
              <p className="text-lg text-white font-light flex justify-center text-center">
                Premium quality, selected fabrics, built to last.
              </p>

              {/* Valeur Authenticity */}
              <div className="space-y-4 flex text-center justify-center pt-12">
                <div>
                  <img src="/home/auth.svg" alt="Authenticity" />
                </div>
              </div>
              <p className="text-lg text-white font-light flex justify-center text-center">
                Authenticity — 100% original designs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Values;
