import { useEffect,useState } from "react";
import api from "../api/axios";

export default function Leaderboard(){

  const [users,setUsers] = useState([]);
  const [error,setError] = useState("");

  useEffect(()=>{
    const fetchLeaderboard = async ()=>{
      try{
        const res = await api.get("/leaderboard");
        setUsers(res.data);
      }catch(err){
        console.error(err);
        setError("Failed to load leaderboard");
      }
    };

    fetchLeaderboard();
  },[]);

  return(
    <div className="min-h-screen bg-black text-white pt-24 flex justify-center">

      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-xl w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          🏆 Eco Leaderboard
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        {users.length === 0 ? (
          <p className="text-center text-gray-300">
            No leaderboard data yet
          </p>
        ) : (
          <ul className="space-y-4">
            {users.map((u,i)=>(
              <li key={i}
                className="flex justify-between bg-white/30 p-4 rounded"
              >
                <span>#{i+1} {u.name}</span>
                <span>{u.ecoPoints} pts</span>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}