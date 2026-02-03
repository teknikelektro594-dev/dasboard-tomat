"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================== TYPE ================== */
type TomatData = {
  status: string;
  warna: string;
  berat: number;
  kategori: string;
  waktu: string;
};

type RiwayatData = TomatData & {
  id: number;
};

/* ================== BADGE HELPER ================== */
const warnaBadge = (warna: string) => {
  switch (warna.toLowerCase()) {
    case "merah":
      return "bg-red-100 text-red-700";
    case "kuning":
      return "bg-yellow-100 text-yellow-700";
    case "hijau":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const kategoriBadge = (kategori: string) => {
  switch (kategori.toLowerCase()) {
    case "kecil":
      return "bg-blue-100 text-blue-700";
    case "sedang":
      return "bg-yellow-100 text-yellow-700";
    case "besar":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Home() {
  const [data, setData] = useState<TomatData | null>(null);
  const [online, setOnline] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatData[]>([]);

  /* ================== DUMMY REALTIME ================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const dummy: TomatData = {
        status: "ONLINE",
        warna: ["Merah", "Kuning", "Hijau"][Math.floor(Math.random() * 3)],
        berat: Math.floor(80 + Math.random() * 120),
        kategori: ["Kecil", "Sedang", "Besar"][Math.floor(Math.random() * 3)],
        waktu: new Date().toISOString(),
      };

      setData(dummy);
      setOnline(true);

      setRiwayat((prev) =>
        [{ id: Date.now(), ...dummy }, ...prev].slice(0, 10)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <p className="p-6">Loading data...</p>;
  }

  const grafikData = riwayat
    .slice()
    .reverse()
    .map((item) => ({
      waktu: new Date(item.waktu).toLocaleTimeString(),
      berat: item.berat,
    }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Monitoring Tomat
        </h1>

        {/* Card Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-gray-500">Status Sistem</p>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
              online ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-gray-500">Warna Tomat</p>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${warnaBadge(data.warna)}`}>
              {data.warna}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-gray-500">Berat</p>
            <p className="font-semibold">{data.berat} gram</p>
          </div>
        </div>

        {/* Grafik */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-semibold mb-4">Grafik Berat Tomat</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grafikData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waktu" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="berat" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Riwayat */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-semibold mb-4">Riwayat Sortir</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">Warna</th>
                <th className="p-2">Berat</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.warna}</td>
                  <td className="p-2">{r.berat}</td>
                  <td className="p-2">{r.kategori}</td>
                  <td className="p-2">
                    {new Date(r.waktu).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
