import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import carAnimation from "../assets/animations/car-insurance-loading.json";

const Hero = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen pt-20 md:pt-5 bg-[#f7f5f0] overflow-hidden">
      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="h-full grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Hero Text */}
            <section
              className="text-black py-12"
              style={{
                transform: `translateY(${scrollY * 0.3}px)`,
                opacity: Math.max(1 - scrollY / 500, 0),
              }}
            >
              <p className="text-sm md:text-base font-semibold tracking-widest uppercase text-black/70 mb-3">
                ---------- Freedom on four wheels
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-black">
                Drive your way <br /> Anytime <br /> Anywhere
              </h1>

              <p className="mt-4 md:mt-6 text-lg md:text-xl text-black/70 max-w-xl">
                Find the perfect car in minutes, flexible rentals, transparent
                pricing and 24/7 support — all in one place.
              </p>

              <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/cars')}
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 
                    transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                    flex items-center justify-center gap-2 text-lg"
                >
                  Book Your Car Now
                </button>

      
              </div>

        
            </section>

            {/* Right Column - Lottie Animation */}
            <div
              className="hidden lg:flex items-center justify-center"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
              }}
            >
              <Lottie
                animationData={carAnimation}
                loop
                autoplay
                className="w-full max-w-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-black/70 text-sm mb-2">Scroll down to explore the categories</span>
        <div className="w-6 h-10 border-2 border-black/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-black/60 rounded-full mt-2"></div>
        </div>
      </div>
    </main>
  );
};

export default Hero;