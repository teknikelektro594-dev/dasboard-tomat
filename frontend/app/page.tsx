"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================== API ================== */
const API_URL =
  "https://script.google.com/macros/s/AKfycbx_KU0nXefVbGW2N9EaDgn1xqJLFZ4687ywLbEFUbnwKQNazs2p2L2slTz78Lv-CoM/exec";

/* ================== TYPE ================== */
type TomatData = {
  status: string;
  warna: string;
  berat: number;
  kategori: string;
  waktu: string;
};

type RiwayatData = {
  id: number;
  warna: string;
  berat: number;
  kategori: string;
  waktu: string;
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
      return "bg-gray-200 text-gray-800";
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
      return "bg-gray-200 text-gray-800";
  }
};

/* ================== PAGE ================== */
export default function Home() {
  const [data, setData] = useState<TomatData | null>(null);
  const [online, setOnline] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatData[]>([]);

  /* ================== DATA DARI SPREADSHEET ================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const rawData: any[] = await res.json();

        const cleanData = rawData.filter(
          (item) => item.warna && item.berat
        );

        if (cleanData.length === 0) {
          setOnline(false);
          return;
        }

        const latest = cleanData[cleanData.length - 1];

        const formatted: TomatData = {
          status: "ONLINE",
          warna: latest.warna,
          berat: Number(latest.berat),
          kategori:
            latest.berat < 200
              ? "Kecil"
              : latest.berat < 400
              ? "Sedang"
              : "Besar",
          waktu: new Date(latest.waktu).toLocaleTimeString(),
        };

        setData(formatted);
        setOnline(true);

        setRiwayat(
          cleanData
            .slice(-10)
            .reverse()
            .map((item, i) => ({
              id: i + 1,
              warna: item.warna,
              berat: Number(item.berat),
              kategori:
                item.berat < 200
                  ? "Kecil"
                  : item.berat < 400
                  ? "Sedang"
                  : "Besar",
              waktu: new Date(item.waktu).toLocaleTimeString(),
            }))
        );
      } catch (error) {
        console.error("Gagal ambil data:", error);
        setOnline(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <p className="p-6 text-gray-900">Selamat datang di website SoBuTo. Alat ini dibuat dari rangkaian, kode program, kopi, dan sedikit overthinking 😉</p>;
  }

  const grafikData = riwayat
    .slice()
    .reverse()
    .map((item) => ({
      waktu: item.waktu,
      berat: item.berat,
    }));

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Monitoring Tomat 🍅</h1>
          <p className="text-gray-600">
            Sistem sortir tomat berbasis Arduino UNO & ESP32
          </p>
        </div>

        {/* Pembuat Alat */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-6 text-center">
            Pembuat Alat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Image
                src="/kholas.jpg"
                alt="Kholis"
                width={130}
                height={130}
                className="rounded-full mb-3"
              />
              <p className="font-semibold">Kholis</p>
              <p className="text-sm text-gray-600">Hardware & Sensor</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/samsul.jpg"
                alt="Samsul"
                width={130}
                height={130}
                className="rounded-full mb-3"
              />
              <p className="font-semibold">Samsul</p>
              <p className="text-sm text-gray-600">Fuzzy Logic</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/aku.jpg"
                alt="Deden"
                width={130}
                height={130}
                className="rounded-full mb-3"
              />
              <p className="font-semibold">Deden</p>
              <p className="text-sm text-gray-600">Web & IoT</p>
            </div>
          </div>
        </div>

        {/* Card Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-sm text-gray-600 mb-2">Status Sistem</p>
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
          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-sm text-gray-600 mb-2">Warna Tomat</p>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${warnaBadge(
                data.warna
              )}`}
            >
              {data.warna}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-sm text-gray-600 mb-2">Berat Tomat</p>
            <p className="text-lg font-semibold">{data.berat} gram</p>
          </div>
        </div>

        {/* 🔹 Hasil Klasifikasi Fuzzy */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Hasil Klasifikasi Fuzzy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-700">Warna</p>
              <p className="font-semibold">{data.warna}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Berat</p>
              <p className="font-semibold">{data.berat} gram</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Kategori</p>
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

        {/* Grafik */}
        <div className="bg-white p-6 rounded-2xl shadow border">
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
                  stroke="#f30b0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Riwayat */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Riwayat Sortir Tomat</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 border-b">
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
                  <td className="p-2 text-gray-600">{item.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
