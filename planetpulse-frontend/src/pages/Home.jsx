import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ✅ Importing Images
import planetSpace from "../assets/planet-space.jpg";
import planetSmoke from "../assets/planet-smoke.jpg";
import planetForests from "../assets/planet-earth-forests.jpg";
import planetCity from "../assets/planet-city.jpg";

// ✅ Image + Quote Array
const images = [
  {
    url: planetSpace,
    quote: "Earth is what we all have in common. 🌍",
  },
  {
    url: planetSmoke,
    quote: "Every degree matters. Stop global warming.",
  },
  {
    url: planetForests,
    quote: "We lose 10 million hectares of forest each year.",
  },
  {
    url: planetCity,
    quote: "Track your carbon. Change your footprint.",
  },
];

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* 🔁 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${images[index].url})` }}
      />

      {/* 🔲 Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* 🧠 Hero Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg max-w-3xl w-full p-6 sm:p-10 text-center border border-white/50 animate-fade-in-up">
          {/* 💬 Quote */}
          <div className="italic bg-white/40 text-green-900 text-sm sm:text-base px-4 py-2 rounded-md mb-6 shadow-sm backdrop-blur-sm">
            {images[index].quote}
          </div>

          {/* 🌿 App Title */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            🌿 Planet Pulse: Your Eco-Companion
          </h1>

          {/* 📝 Description */}
          <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed drop-shadow">
            PlanetPulse empowers you to measure, understand, and improve your daily carbon footprint — helping you take small steps toward a greener future.
          </p>

          {/* 🚀 Call to Action */}
          <Link to="/tracker">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-300">
              🚀 Start Tracking Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
