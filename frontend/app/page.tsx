"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // ⬅️ TAMBAHAN
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
      return "bg-black-200 text-black-800";
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
      return "bg-black-200 text-black-800";
  }
};

/* ================== PAGE ================== */
export default function Home() {
  const [data, setData] = useState<TomatData | null>(null);
  const [online, setOnline] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatData[]>([]);

  /* ================== DUMMY DATA REALTIME ================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const dummy: TomatData = {
        status: "ONLINE",
        warna: ["Merah", "Kuning", "Hijau"][Math.floor(Math.random() * 3)],
        berat: Math.floor(Math.random() * 80) + 120,
        kategori: ["Kecil", "Sedang", "Besar"][Math.floor(Math.random() * 3)],
        waktu: new Date().toLocaleTimeString(),
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
    return <p className="p-6 text-black-900">Loading data...</p>;
  }

  const grafikData = riwayat
    .slice()
    .reverse()
    .map((item) => ({
      waktu: item.waktu,
      berat: item.berat,
    }));

  return (
    <div className="min-h-screen bg-black-100 p-6 text-black-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black-900">
            Dashboard Monitoring Tomat
          </h1>
          <p className="text-black-700 md:text-black-600">
            Sistem sortir tomat berbasis Arduino UNO dan ESP32 Dev Module
          </p>
        </div>

        {/* 🔽 PEMBUAT ALAT (TAMBAHAN SAJA) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6 text-center">
            Pembuat Alat
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/kholas.jpg"
                alt="Pembuat 1"
                width={120}
                height={120}
                className="rounded-full shadow mb-3"
              />
              <p className="font-semibold">Nama Orang 1</p>
              <p className="text-sm text-black-600">Hardware & Sensor</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Image
                src="/samsul.jpg"
                alt="Pembuat 2"
                width={120}
                height={120}
                className="rounded-full shadow mb-3"
              />
              <p className="font-semibold">Nama Orang 2</p>
              <p className="text-sm text-black-600">Fuzzy Logic</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Image
                src="/aku.jpg"
                alt="Pembuat 3"
                width={120}
                height={120}
                className="rounded-full shadow mb-3"
              />
              <p className="font-semibold">Nama Orang 3</p>
              <p className="text-sm text-black-600">Web & IoT</p>
            </div>
          </div>
        </div>

        {/* Card Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-sm text-black-700 mb-2">Status Sistem</p>
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
            <p className="text-sm text-black-700 mb-2">Warna Tomat</p>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${warnaBadge(
                data.warna
              )}`}
            >
              {data.warna}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-sm text-black-700 mb-2">Berat Tomat</p>
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
              <p className="text-sm text-black-700">Warna</p>
              <p className="font-semibold">{data.warna}</p>
            </div>

            <div>
              <p className="text-sm text-black-700">Berat</p>
              <p className="font-semibold">{data.berat} gram</p>
            </div>

            <div>
              <p className="text-sm text-black-700">Kategori</p>
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

        {/* TABEL HASIL KLASIFIKASI FUZZY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Tabel Hasil Klasifikasi Fuzzy
          </h2>

          <table className="w-full text-sm border">
            <thead className="bg-black-100 border-b">
              <tr>
                <th className="p-2 text-left">Warna</th>
                <th className="p-2 text-left">Berat (g)</th>
                <th className="p-2 text-left">Kategori</th>
                <th className="p-2 text-left">Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">{data.warna}</td>
                <td className="p-2">{data.berat}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${kategoriBadge(
                      data.kategori
                    )}`}
                  >
                    {data.kategori}
                  </span>
                </td>
                <td className="p-2 text-black-700">{data.waktu}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grafik */}
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

{/* RIWAYAT SORTIR TOMAT */}
<div className="bg-white p-6 rounded-2xl shadow-sm border">
  <h2 className="text-lg font-semibold mb-4 text-gray-900">
    Riwayat Sortir Tomat
  </h2>

  {riwayat.length === 0 ? (
    <p className="text-gray-500">Belum ada data sortir</p>
  ) : (
    <table className="w-full text-sm border text-gray-900">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="p-2 text-left">No</th>
          <th className="p-2 text-left">Warna</th>
          <th className="p-2 text-left">Berat (g)</th>
          <th className="p-2 text-left">Kategori</th>
          <th className="p-2 text-left">Waktu</th>
        </tr>
      </thead>
      <tbody>
        {riwayat.map((item, index) => (
          <tr key={item.id} className="border-b">
            <td className="p-2">{index + 1}</td>
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
            <td className="p-2 text-gray-700">{item.waktu}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      </div>
    </div>
  );
}
