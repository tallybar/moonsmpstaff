<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rank Change Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .form-container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      width: 350px;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    label {
      font-weight: bold;
      display: block;
      margin-top: 10px;
    }
    input, select, textarea, button {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    button {
      background: #4f46e5;
      color: white;
      font-size: 16px;
      cursor: pointer;
      margin-top: 15px;
      transition: 0.2s;
    }
    button:hover {
      background: #4338ca;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Rank Change Request</h2>
    <form id="rankForm">
      <label for="requestType">Request Type</label>
      <select id="requestType" name="requestType" required>
        <option value="Promotion">Promotion</option>
        <option value="Demotion">Demotion</option>
        <option value="Resign">Resign</option>
      </select>

      <label for="discordId">Discord ID</label>
      <input type="text" id="discordId" name="discordId" required>

      <label for="mention">IGN (In-game name)</label>
      <input type="text" id="mention" name="mention" required>

      <label for="currentRank">Current Rank</label>
      <input type="text" id="currentRank" name="currentRank" required>

      <label for="updatedRank">Updated Rank</label>
      <input type="text" id="updatedRank" name="updatedRank">

      <label for="reason">Reason</label>
      <textarea id="reason" name="reason" rows="3"></textarea>

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>

      <button type="submit">Submit Request</button>
    </form>
  </div>

  <script>
    document.getElementById("rankForm").addEventListener("submit", async function(e) {
      e.preventDefault();

      const formData = {
        requestType: document.getElementById("requestType").value,
        discordId: document.getElementById("discordId").value,
        mention: document.getElementById("mention").value,
        currentRank: document.getElementById("currentRank").value,
        updatedRank: document.getElementById("updatedRank").value,
        reason: document.getElementById("reason").value,
        password: document.getElementById("password").value
      };

      try {
        const res = await fetch("/submit-rank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        alert(data.message);
        if (data.success) document.getElementById("rankForm").reset();
      } catch (err) {
        console.error(err);
        alert("⚠️ Error sending request");
      }
    });
  </script>
</body>
</html>
