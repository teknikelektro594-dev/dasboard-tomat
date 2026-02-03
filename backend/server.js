const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// data dummy awal
let dataTomat = {
  status: "ONLINE",
  warna: "Merah",
  berat: 145,
  kategori: "Besar",
  waktu: new Date().toLocaleTimeString(),
};

// cek server
app.get("/", (req, res) => {
  res.send("Backend Tomat Aktif 🚀");
});

// GET data dari ESP32
app.get("/api/esp32", (req, res) => {
  res.json(dataTomat);
});

// POST data dari ESP32
app.post("/api/esp32", (req, res) => {
  dataTomat = {
    ...req.body,
    waktu: new Date().toLocaleTimeString(),
  };
  res.json({ message: "Data diterima" });
});

// PORT dinamis untuk hosting
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend jalan di port ${PORT}`);
});
