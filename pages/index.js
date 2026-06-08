
import { useEffect, useState } from "react";

export default function Home() {
  const [countdown, setCountdown] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const campDate = new Date("June 25, 2027 00:00:00");

    function update() {
      const now = new Date();

      // Message logic
      if (now < new Date("May 1, 2027")) {
        setMessage("Orders are currently closed for the season. Please come back in 2027.");
      } else if (now <= new Date("May 31, 2027")) {
        setMessage("Orders are OPEN! Get yours before May 31.");
      } else {
        setMessage("Orders are now closed. See you at camp!");
      }

      // Countdown
      const diff = campDate - now;
      if (diff <= 0) {
        setCountdown("🎉 Campout is happening now!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`⏳ ${days}d ${hours}h ${minutes}m ${seconds}s until Campout`);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      color: "white",
      fontFamily: "Arial",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.08)",
        padding: "40px",
        borderRadius: "16px",
        maxWidth: "550px"
      }}>
        <h1>Cooper Campout</h1>
        <div>⛺ Outdoor Adventure Experience</div>

        <div style={{ fontSize: "60px", margin: "20px 0" }}>⛺</div>

        <p>{message}</p>

        <div style={{ fontWeight: "bold", marginTop: "20px" }}>
          {countdown}
        </div>

        <div style={{
          marginTop: "20px",
          textAlign: "left",
          background: "rgba(255,255,255,0.1)",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <h3 style={{ textAlign: "center" }}>2027 Important Dates</h3>
          <p>🗳️ Voting Opens: April 15, 2027</p>
          <p>🛒 Orders Open: May 1, 2027</p>
          <p>🛑 Orders Close: May 31, 2027</p>
          <p>🏕️ Campout: June 25–27, 2027</p>
        </div>
      </div>
    </div>
  );
}
