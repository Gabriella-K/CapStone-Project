import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors()); 

//API for fetching popular Artists
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

//API for fetching popular songs
app.get("/api/popular", async (req, res) => {
  try {
    const response = await fetch("https://api.deezer.com/chart/0/tracks");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular songs" });
  }
});

// API for fetching all genres
app.get("/api/genres", async (req, res) => {
  try {
    const response = await fetch("https://api.deezer.com/genre");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

// API for fetching tracks by genre ID
app.get("/api/genres/:id", async (req, res) => {
  const genreId = req.params.id;
  try {
    const response = await fetch(`https://api.deezer.com/chart/${genreId}/tracks`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching genre tracks:", error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: API for fetching artist's top tracks
app.get("/api/artist/:id/top", async (req, res) => {
  const artistId = req.params.id;
  try {
    const response = await fetch(`https://api.deezer.com/artist/${artistId}/top?limit=50`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching artist top tracks:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});