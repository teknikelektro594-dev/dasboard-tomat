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
  waktu: new Date().toLocaleTimeString()
};

app.get("/api/esp32", (req, res) => {
  res.json(dataTomat);
});

app.post("/api/esp32", (req, res) => {
  dataTomat = {
    ...req.body,
    waktu: new Date().toLocaleTimeString()
  };
  res.json({ message: "Data diterima" });
});

app.listen(3001, () => {
  console.log("Backend jalan di http://localhost:3001");
});
