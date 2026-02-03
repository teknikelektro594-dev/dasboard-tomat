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

/* ================== BADGE ================== */
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

  /* ===== DUMMY DATA UNTUK ONLINE DEMO ===== */
  useEffect(() => {
    const dummy: TomatData = {
      status: "ONLINE",
      warna: "Merah",
      berat: 150,
      kategori: "Besar",
      waktu: new Date().toLocaleTimeString(),
    };

    setTimeout(() => {
      setData(dummy);
      setOnline(true);
      setRiwayat([{ id: Date.now(), ...dummy }]);
    }, 1000);
  }, []);

  if (!data) {
    return <p className="p-6">Loading data...</p>;
  }

  const grafikData = riwayat.map((item) => ({
    waktu: item.waktu,
    berat: item.berat,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">
          Dashboard Monitoring Tomat
        </h1>

        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border">
            <p>Status</p>
            <span className="text-green-700 font-semibold">ONLINE</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p>Warna</p>
            <span className={warnaBadge(data.warna)}>
              {data.warna}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p>Berat</p>
            <p className="font-semibold">{data.berat} gram</p>
          </div>
        </div>

        {/* FUZZY */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-semibold mb-4">Hasil Klasifikasi Fuzzy</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>{data.warna}</div>
            <div>{data.berat} g</div>
            <div className={kategoriBadge(data.kategori)}>
              {data.kategori}
            </div>
          </div>
        </div>

        {/* GRAFIK */}
        <div className="bg-white p-6 rounded-2xl border h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={grafikData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="waktu" />
              <YAxis />
              <Tooltip />
              <Line dataKey="berat" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RIWAYAT */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-semibold mb-4">Riwayat Sortir</h2>
          <table className="w-full">
            <tbody>
              {riwayat.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.warna}</td>
                  <td>{r.berat}</td>
                  <td>{r.kategori}</td>
                  <td>{r.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
