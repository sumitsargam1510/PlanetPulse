import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";

const COLORS = ["#34d399", "#60a5fa", "#f87171"];

export default function ProfilePage() {

  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState([]);
  const [totalCO2, setTotalCO2] = useState("0.00");

  const [ecoPoints, setEcoPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const [user, setUser] = useState(null);
  const [mission, setMission] = useState(null);

  const bgImages = [
    {
      url: "https://images.unsplash.com/photo-1600787953307-4b5d9027a06b",
      quote: "Progress over perfection 🌿"
    },
    {
      url: "https://images.unsplash.com/photo-1609838463542-0f1aa0f15c54",
      quote: "Small steps lead to big change 🌍"
    }
  ];

  // Background rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {

        const userRes = await api.get("/users/me");
        const historyRes = await api.get("/emissions/history");
        const totalRes = await api.get("/emissions/total");
        const missionRes = await api.get("/missions/daily");

        setUser(userRes.data);
        setEcoPoints(userRes.data.ecoPoints);
        setStreak(userRes.data.streakCount);

        const formatted = historyRes.data.map(e => ({
          type:
            e.activity === "driving"
              ? "Driving"
              : e.activity === "electricity"
              ? "Electricity"
              : "Flights",
          co2: Number(e.co2Emission)
        }));

        setEntries(formatted);
        setTotalCO2(Number(totalRes.data).toFixed(2));
        setMission(missionRes.data);

      } catch (err) {
        console.error("Profile load failed", err);
      }
    };

    fetchData();
  }, []);

  // Mission complete
  const completeMission = async () => {
    try {
      await api.post(`/missions/complete/${mission.id}`);

      alert(`Mission Completed! +${mission.points} points`);

      // update UI without reload
      setEcoPoints(prev => prev + mission.points);

    } catch (err) {
      console.error(err);
    }
  };

  // Badge logic
  const getBadge = () => {
    if (ecoPoints > 150) return "🌍 Eco Hero";
    if (ecoPoints > 50) return "🌿 Green Warrior";
    return "🌱 Beginner";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black pt-20">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${bgImages[index].url})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/40 p-6 sm:p-10 text-white">

        {/* Quote */}
        <p className="italic text-green-900 bg-white/40 px-4 py-2 rounded mb-6 text-center">
          {bgImages[index].quote}
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
          🌿 Your Carbon Report
        </h1>

        {/* PROFILE + STATS LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* 👤 Profile Card */}
          <div className="bg-white/30 p-6 rounded-lg text-center">

            {user ? (
              <>
                <h2 className="text-xl font-bold">👤 {user.name}</h2>
                <p>{user.email}</p>
                {user.age && <p>Age: {user.age}</p>}
              </>
            ) : (
              <p>Loading profile...</p>
            )}

          </div>

          {/* 🔥 Stats */}
          <div className="md:col-span-2 flex justify-center gap-10 items-center bg-white/20 rounded-lg p-6">

            <div className="text-center">
              <div className="text-3xl">🔥</div>
              <div className="font-bold">{streak}</div>
              <div>Streak</div>
            </div>

            <div className="text-center">
              <div className="text-3xl">🪙</div>
              <div className="font-bold">{ecoPoints}</div>
              <div>Eco Points</div>
            </div>

          </div>

        </div>

        {/* 🏅 Reward Badge */}
        <div className="bg-white/30 p-4 rounded text-center mb-6">
          <h3 className="font-bold">🏅 Your Badge</h3>
          <p className="text-lg">{getBadge()}</p>
        </div>

        {/* 🌱 Daily Mission */}
        {mission && (
          <div className="bg-white/30 p-4 rounded mb-6 text-center">
            <h3 className="font-bold">🌱 Today's Mission</h3>
            <p>{mission.title}</p>
            <p className="text-sm">{mission.description}</p>

            <button
              onClick={completeMission}
              className="mt-2 bg-green-500 px-4 py-2 rounded"
            >
              Complete (+{mission.points})
            </button>
          </div>
        )}

        {/* 📊 Analytics */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-4">Summary</h3>

            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li key={i} className="flex justify-between bg-white/30 p-2 rounded">
                  <span>{e.type}</span>
                  <span>{e.co2} kg</span>
                </li>
              ))}

              <li className="flex justify-between mt-3 font-bold">
                <span>Total</span>
                <span>{totalCO2} kg</span>
              </li>
            </ul>
          </div>

          {/* Chart */}
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={entries} dataKey="co2" nameKey="type" outerRadius={90}>
                  {entries.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-green-800 font-semibold">
          ✅ Keep building eco-friendly habits!
        </div>

      </div>
    </div>
  );
}