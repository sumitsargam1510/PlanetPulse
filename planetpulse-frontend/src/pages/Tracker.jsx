import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const activityIcons = {
  Driving: "🚗",
  Electricity: "⚡",
  Flights: "✈️",
};

const guestCO2Factors = {
  Driving: 0.12,
  Electricity: 0.82,
  Flights: 0.15,
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TrackingPage() {
  const isAuthenticated = !!localStorage.getItem("token");

  const [activityType, setActivityType] = useState("Driving");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  const images = [
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80",
      quote: "Track your carbon. Change your footprint.",
    },
    {
      url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1470&q=80",
      quote: "Every small step matters.",
    },
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 NEW: Load saved history if logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get("/emissions/history");

        const formatted = res.data.map((e) => ({
          id: e.id || Math.random(),
          type:
            e.activity === "driving"
              ? "Driving"
              : e.activity === "electricity"
              ? "Electricity"
              : "Flights",
          quantity: e.amount,
          date: e.createdAt,
          co2: Number(e.co2Emission).toFixed(2),
        }));

        setEntries(formatted.reverse());
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const addEntry = async (e) => {
    e.preventDefault();

    if (!quantity || !date) {
      setError("Please fill all fields.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be positive.");
      return;
    }

    setError("");

    if (isAuthenticated) {
      try {
        const res = await api.post("/emissions/calculate", {
          activity:
            activityType === "Driving"
              ? "driving"
              : activityType === "Electricity"
              ? "electricity"
              : "flight",
          amount: Number(quantity),
          unit: "count",
        });

        const newEntry = {
          id: Date.now(),
          type: activityType,
          quantity,
          date,
          co2: res.data.co2Emission.toFixed(2),
        };

        setEntries([newEntry, ...entries]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to save activity.");
        return;
      }
    } else {
      const co2 = (
        Number(quantity) * guestCO2Factors[activityType]
      ).toFixed(2);

      const newEntry = {
        id: Date.now(),
        type: activityType,
        quantity,
        date,
        co2,
      };

      setEntries([newEntry, ...entries]);
    }

    setQuantity("");
    setDate("");
  };

  const totalCO2 = entries
    .reduce((sum, e) => sum + parseFloat(e.co2), 0)
    .toFixed(2);

  let feedback = {
    emoji: "🌱",
    message: "Start tracking to see your impact!",
    color: "bg-gray-200 text-gray-800",
  };

  const total = parseFloat(totalCO2);

  if (total > 300) {
    feedback = {
      emoji: "⚠️",
      message: "High emissions! Try reducing car travel 🚨",
      color: "bg-red-100 text-red-800",
    };
  } else if (total > 100) {
    feedback = {
      emoji: "💡",
      message: "You're doing okay! Keep improving 🌎",
      color: "bg-yellow-100 text-yellow-800",
    };
  } else if (total > 0) {
    feedback = {
      emoji: "✅",
      message: "Awesome! You're keeping emissions low 🌿",
      color: "bg-green-100 text-green-800",
    };
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-black pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${images[bgIndex].url})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <main className="relative z-10 max-w-4xl w-full bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6 sm:p-10 mt-8 mb-16 animate-fade-in-up text-green-950">

        <div className="italic bg-white/40 text-green-900 text-sm sm:text-base px-4 py-2 rounded-md mb-6 text-center shadow-sm backdrop-blur-sm drop-shadow-md">
          {images[bgIndex].quote}
        </div>

        <div className={`rounded-md px-4 py-3 mb-6 text-center font-semibold shadow-sm drop-shadow-md ${feedback.color}`}>
          {feedback.emoji} {feedback.message}
        </div>

        {!isAuthenticated && (
          <div className="mb-6 text-center text-green-950 text-sm sm:text-base">
            Want to save your progress?{" "}
            <Link
              to="/signup"
              className="underline text-blue-300 hover:text-blue-400 font-semibold"
            >
              Sign up
            </Link>{" "}
            to track your carbon history.
          </div>
        )}

        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          🌿 Track Your Carbon Footprint
        </h1>

        <form onSubmit={addEntry} className="flex flex-col lg:flex-row flex-wrap gap-6 mb-8">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="font-semibold mb-1 text-white/90">
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="rounded-md border border-blue-300 px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="Driving">🚗 Driving</option>
              <option value="Electricity">⚡ Electricity</option>
              <option value="Flights">✈️ Flights</option>
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="font-semibold mb-1 text-white/90">Quantity</label>
            <input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-md border border-blue-300 px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>

          {/* 🔥 Date Picker Visible */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="font-semibold mb-1 text-white/90">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white text-black border border-blue-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full appearance-auto"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 self-end mt-2 transition shadow-lg"
          >
            Add Activity
          </button>
        </form>

        {error && (
          <p className="text-red-600 font-semibold mb-6 text-center drop-shadow-md">
            {error}
          </p>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white pb-2 text-white drop-shadow-md">
            Tracked Activities
          </h2>

          {entries.length === 0 ? (
            <p className="italic text-green-950 text-center text-lg drop-shadow-sm">
              🚫 No activities tracked yet.
            </p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map(({ id, type, quantity, date, co2 }) => (
                <li
                  key={id}
                  className="flex justify-between items-center bg-white/30 rounded-md p-3 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{activityIcons[type]}</span>
                    <div>
                      <p className="font-semibold">{type}</p>
                      <p className="text-sm">
                        {quantity} on {formatDate(date)}
                      </p>
                    </div>
                  </div>
                  <div className="font-semibold text-green-700">
                    {co2} kg CO₂
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-10 text-right text-xl sm:text-2xl font-bold text-white">
          🌡️ Total CO₂: <span className="text-green-300">{totalCO2} kg</span>
        </div>
      </main>
    </div>
  );
}
