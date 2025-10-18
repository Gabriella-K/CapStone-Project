import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoriteProvider } from "./context/FavoriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <AuthProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </AuthProvider>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>
);
