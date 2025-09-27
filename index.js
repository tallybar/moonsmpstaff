<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rank Change Request</title>
  <link rel="stylesheet" href="style.css">
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

  <script src="rank.js"></script>
</body>
</html>
