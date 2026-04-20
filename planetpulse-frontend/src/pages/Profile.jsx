import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";

const COLORS = ["#34d399", "#60a5fa", "#f87171"];

export default function ProfilePage() {

  const [index,setIndex] = useState(0);
  const [entries,setEntries] = useState([]);
  const [totalCO2,setTotalCO2] = useState("0.00");

  const [ecoPoints,setEcoPoints] = useState(0);
  const [streak,setStreak] = useState(0);

  const [user,setUser] = useState(null);
  const [mission,setMission] = useState(null);

  const bgImages = [
    {
      url:"https://images.unsplash.com/photo-1600787953307-4b5d9027a06b?auto=format&fit=crop&w=1470&q=80",
      quote:"Progress over perfection 🌿"
    },
    {
      url:"https://images.unsplash.com/photo-1609838463542-0f1aa0f15c54?auto=format&fit=crop&w=1470&q=80",
      quote:"Small steps lead to big change 🌍"
    }
  ];

  useEffect(()=>{
    const interval = setInterval(()=>{
      setIndex(prev => (prev+1)%bgImages.length);
    },8000);
    return ()=>clearInterval(interval);
  },[]);

  useEffect(()=>{

    const fetchData = async ()=>{
      try{

        // fetch user profile
        const userRes = await api.get("/users/me");

        // fetch emissions
        const historyRes = await api.get("/emissions/history");
        const totalRes = await api.get("/emissions/total");

        // fetch today's mission
        const missionRes = await api.get("/missions/daily");

        const formatted = historyRes.data.map(e=>({
          type:
            e.activity === "driving"
            ? "Driving"
            : e.activity === "electricity"
            ? "Electricity"
            : "Flights",
          co2:Number(e.co2Emission)
        }));

        setEntries(formatted);
        setTotalCO2(Number(totalRes.data).toFixed(2));

        // set user data
        setUser(userRes.data);
        setEcoPoints(userRes.data.ecoPoints);
        setStreak(userRes.data.streakCount);

        setMission(missionRes.data);

      }catch(err){
        console.error("Profile fetch failed", err);
      }
    };

    fetchData();

  },[]);

  const completeMission = async ()=>{
  try{

    await api.post(`/missions/complete/${mission.id}`);

    alert(`Mission Completed! +${mission.points} points`);

    // update UI without reload
    setEcoPoints(prev => prev + mission.points);

  }catch(err){
    console.error(err);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">

      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{backgroundImage:`url(${bgImages[index].url})`}}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"/>

      <div className="relative z-10 bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-xl max-w-4xl w-full p-6 sm:p-10 mx-4 animate-fade-in-up text-white">

        <p className="italic text-green-900 bg-white/40 px-4 py-2 rounded mb-6 shadow-sm backdrop-blur-sm text-center drop-shadow">
          {bgImages[index].quote}
        </p>

        <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-6 text-center drop-shadow">
          🌿 Your Carbon Report
        </h1>

        {/* 👤 User Profile Info */}
        {user ? (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">👤 {user.name}</h2>
            <p className="text-sm">{user.email}</p>
            {user.age && (
              <p className="text-sm">Age: {user.age}</p>
            )}
          </div>
        ): (
          <p className="text-center text-gray-300 mb-6">
            Loading profile...
          </p>
        )}

        {/* 🔥 Gamification */}
        <div className="flex justify-center gap-10 mb-6 text-center">

          <div className="bg-white/30 px-6 py-4 rounded-lg">
            <div className="text-3xl">🔥</div>
            <div className="font-bold">{streak}</div>
            <div className="text-sm">Day Streak</div>
          </div>

          <div className="bg-white/30 px-6 py-4 rounded-lg">
            <div className="text-3xl">🪙</div>
            <div className="font-bold">{ecoPoints}</div>
            <div className="text-sm">Eco Points</div>
          </div>

        </div>

        {/* 🌱 Daily Mission */}
        {mission && (
          <div className="bg-white/30 p-4 rounded mb-6 text-center">
            <h3 className="font-bold text-lg">🌱 Today's Eco Mission</h3>
            <p className="mt-2">{mission.title}</p>
            <p className="text-sm">{mission.description}</p>

            <button
              onClick={completeMission}
              className="mt-3 bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
            >
              Complete Mission (+{mission.points})
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Summary */}
          <div>
            <div className="text-lg font-semibold mb-4">Summary</div>

            <ul className="space-y-2">
              {entries.map(({type,co2})=>(
                <li
                  key={type+co2}
                  className="flex justify-between bg-white/30 text-black px-4 py-2 rounded shadow-sm backdrop-blur-sm"
                >
                  <span>{type}</span>
                  <span className="font-semibold text-green-800">
                    {co2} kg CO₂
                  </span>
                </li>
              ))}

              <li className="flex justify-between px-4 py-2 border-t border-white/50 pt-2 text-white">
                <span>Total</span>
                <span className="font-bold">{totalCO2} kg CO₂</span>
              </li>

            </ul>
          </div>

          {/* Pie Chart */}
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={entries}
                  dataKey="co2"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {entries.map((entry,index)=>(
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip/>

              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="mt-8 bg-green-100 text-green-800 font-semibold text-center py-3 rounded-lg drop-shadow">
          ✅ Keep it up! You're building eco-friendly habits!
        </div>

      </div>
    </div>
  );
}