import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors()); 


app.get("/api/trending", async (req, res) => {
  try {
    const response = await fetch("https://api.deezer.com/chart");
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching Deezer data:", error);
    res.status(500).json({ error: "Failed to fetch Deezer data" });
  }
});

app.get("/api/popular", async (req, res) => {
  try {
    const response = await fetch("https://api.deezer.com/chart/0/tracks");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular songs" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
