import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Marketplace() {

  const [credits, setCredits] = useState([]);
  const [form, setForm] = useState({
    sellerName: "",
    credits: "",
    price: ""
  });

  const fetchCredits = async () => {
    const res = await api.get("/market");
    setCredits(res.data);
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleSell = async (e) => {
    e.preventDefault();

    await api.post("/market/sell", form);

    setForm({ sellerName: "", credits: "", price: "" });
    fetchCredits();
  };

  const buyCredit = async (id) => {
    await api.post(`/market/buy/${id}`);
    fetchCredits();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 flex justify-center">

      <div className="max-w-4xl w-full bg-white/20 backdrop-blur-lg p-8 rounded-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          🌍 Carbon Credit Marketplace
        </h1>

        {/* Sell Form */}
        <form onSubmit={handleSell} className="mb-6 space-y-3">

          <input
            placeholder="Your Name"
            value={form.sellerName}
            onChange={(e)=>setForm({...form, sellerName:e.target.value})}
            className="w-full p-2 rounded text-black"
            required
          />

          <input
            type="number"
            placeholder="Credits"
            value={form.credits}
            onChange={(e)=>setForm({...form, credits:e.target.value})}
            className="w-full p-2 rounded text-black"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e)=>setForm({...form, price:e.target.value})}
            className="w-full p-2 rounded text-black"
            required
          />

          <button className="bg-green-500 px-4 py-2 rounded w-full">
            Sell Credits
          </button>

        </form>

        {/* Market List */}
        <ul className="space-y-4">

          {credits.map(c => (
            <li key={c.id}
              className="flex justify-between items-center bg-white/30 p-4 rounded"
            >
              <div>
                <p>{c.sellerName}</p>
                <p>{c.credits} credits</p>
                <p>₹{c.price}</p>
              </div>

              {!c.sold ? (
                <button
                  onClick={()=>buyCredit(c.id)}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Buy
                </button>
              ) : (
                <span className="text-red-400">Sold</span>
              )}

            </li>
          ))}

        </ul>

      </div>
    </div>
  );
}