<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cooper Campout</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }

    .container {
      background: rgba(255, 255, 255, 0.08);
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      max-width: 550px;
    }

    h1 {
      font-size: 2.7rem;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 1.2rem;
      margin-bottom: 20px;
      opacity: 0.9;
    }

    .tent {
      width: 0;
      height: 0;
      border-left: 60px solid transparent;
      border-right: 60px solid transparent;
      border-bottom: 90px solid #ffcc66;
      margin: 0 auto 25px;
      position: relative;
    }

    .tent::after {
      content: '';
      position: absolute;
      left: -15px;
      top: 30px;
      width: 30px;
      height: 60px;
      background: #8b5a2b;
      border-radius: 3px;
    }

    #message {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    .countdown {
      font-size: 1.4rem;
      margin: 20px 0;
      font-weight: bold;
    }

    .calendar {
      text-align: left;
      margin-top: 20px;
      font-size: 0.95rem;
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 10px;
    }

    .calendar h3 {
      margin-top: 0;
      text-align: center;
    }

    .calendar p {
      margin: 5px 0;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Cooper Campout</h1>
  <div class="subtitle">⛺ Outdoor Adventure Experience</div>

  <div class="tent"></div>

  <p id="message"></p>

  <div class="countdown" id="countdown"></div>

  <div class="calendar">
    <h3>2027 Important Dates</h3>
    <p>🗳️ Voting Opens: April 15, 2027</p>
    <p>🛒 Orders Open: May 1, 2027</p>
    <p>🛑 Orders Close: May 31, 2027</p>
    <p>🏕️ Campout: June 25–27, 2027</p>
  </div>
</div>

<script>
  const now = new Date();
  const campDate = new Date("June 25, 2027 00:00:00");

  const messageEl = document.getElementById("message");

  if (now < new Date("May 1, 2027")) {
    messageEl.textContent = "Orders are currently closed for the season. Please come back in 2027.";
  } else if (now <= new Date("May 31, 2027")) {
    messageEl.textContent = "Orders are OPEN! Get yours before May 31.";
  } else {
    messageEl.textContent = "Orders are now closed. See you at camp!";
  }

  function updateCountdown() {
    const now = new Date();
    const diff = campDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").textContent = "🎉 Campout is happening now!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").textContent =
      `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s until Campout`;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
</script>

</body>
</html>
