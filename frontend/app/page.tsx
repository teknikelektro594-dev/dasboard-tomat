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

/* ================== PAGE ================== */
export default function Home() {
  const [data, setData] = useState<TomatData | null>(null);
  const [online, setOnline] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3001/api/esp32")
        .then((res) => res.json())
        .then((json: TomatData) => {
          setData(json);
          setOnline(true);

          setRiwayat((prev) =>
            [{ id: Date.now(), ...json }, ...prev].slice(0, 10)
          );
        })
        .catch(() => setOnline(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
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

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Monitoring Tomat
          </h1>
          <p className="text-gray-500">
            Sistem sortir tomat berbasis Arduino UNO dan ESP32 Dev Module
          </p>
        </div>

        {/* Card Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-2">Status Sistem</p>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                online
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-2">Warna Tomat</p>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${warnaBadge(
                data.warna
              )}`}
            >
              {data.warna}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-2">Berat Tomat</p>
            <p className="text-lg font-semibold">{data.berat} gram</p>
          </div>
        </div>

        {/* Hasil Klasifikasi Fuzzy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Hasil Klasifikasi Fuzzy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Warna</p>
              <p className="font-semibold">{data.warna}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Berat</p>
              <p className="font-semibold">{data.berat} gram</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Kategori</p>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${kategoriBadge(
                  data.kategori
                )}`}
              >
                {data.kategori}
              </span>
            </div>
          </div>
        </div>

        {/* Grafik Berat Tomat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Grafik Berat Tomat Realtime
          </h2>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grafikData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waktu" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="berat"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Riwayat Sortir Tomat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Riwayat Sortir Tomat
          </h2>

          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">Warna</th>
                <th className="p-2">Berat (g)</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((item, i) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${warnaBadge(
                        item.warna
                      )}`}
                    >
                      {item.warna}
                    </span>
                  </td>
                  <td className="p-2">{item.berat}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${kategoriBadge(
                        item.kategori
                      )}`}
                    >
                      {item.kategori}
                    </span>
                  </td>
                  <td className="p-2 text-gray-500">
                    {new Date(item.waktu).toLocaleTimeString()}
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
