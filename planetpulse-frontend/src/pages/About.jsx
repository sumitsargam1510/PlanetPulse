import { useEffect, useState } from "react";

// Backgrounds + quotes
const backgrounds = [
  {
    url: "https://images.unsplash.com/photo-1581091215367-59d180b0c2c3?auto=format&fit=crop&w=1470&q=80",
    quote: "“The Earth is what we all have in common.” – Wendell Berry",
  },
  {
    url: "https://images.unsplash.com/photo-1549887534-3ec93abae06e?auto=format&fit=crop&w=1470&q=80",
    quote: "“We don’t inherit the Earth from our ancestors, we borrow it from our children.”",
  },
];

export default function About() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* 🔁 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backgrounds[bgIndex].url})` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full p-6 sm:p-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg text-white animate-fade-in-up">
        {/* Quote */}
        <div className="italic bg-white/40 text-green-900 text-sm sm:text-base px-4 py-2 rounded-md mb-6 text-center shadow-sm backdrop-blur-sm drop-shadow-md">
          {backgrounds[bgIndex].quote}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-6 text-center drop-shadow-md">
          🌿 PlanetPulse: About Us
        </h1>

        <p className="mb-4 text-white/90 leading-relaxed drop-shadow">
          PlanetPulse is your eco-companion, helping you track and reduce your daily carbon emissions. We believe that small actions, when multiplied by millions, can transform the world.
        </p>

        <p className="mb-4 text-white/90 leading-relaxed drop-shadow">
          Whether you're commuting, using electricity, or flying, PlanetPulse allows you to log your activities and understand their impact on the environment. It's all about creating awareness and encouraging climate-conscious choices.
        </p>

        <p className="mb-4 text-white/90 leading-relaxed drop-shadow">
          Our goal is simple: make carbon tracking effortless, educational, and empowering. Together, we can lower our footprints and raise our voices for a healthier planet. 🌎
        </p>

        <p className="text-white/80 italic text-center mt-6 drop-shadow">
          Thank you for being part of the pulse that drives a greener tomorrow.
        </p>
      </div>
    </div>
  );
}
