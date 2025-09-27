const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const { correctPassword, webhookURLs } = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // serve static HTML/JS/CSS

// Endpoint to handle rank requests
app.post("/submit-rank", async (req, res) => {
  const { requestType, discordId, mention, currentRank, updatedRank, reason, password } = req.body;

  if (password !== correctPassword) {
    return res.status(401).json({ success: false, message: "❌ Incorrect password" });
  }

  let title = "", color = 0x4f46e5;
  let description = "";

  if (requestType === "Promotion") {
    title = "<:Green:1421387917791854755> Promoted";
    color = 0x2ecc71;
    description = [
      `**Discord ID:** ${discordId}`,
      `**IGN:** ${mention}`,
      `**From:** ${currentRank}`,
      `**To:** ${updatedRank}`,
      `**Reason:** ${reason}`
    ].join("\n");
  } else if (requestType === "Demotion") {
    title = "<:Red:1421387876867768371> Demoted";
    color = 0xe74c3c;
    description = [
      `**Discord ID:** ${discordId}`,
      `**IGN:** ${mention}`,
      `**From:** ${currentRank}`,
      `**To:** ${updatedRank}`,
      `**Reason:** ${reason}`
    ].join("\n");
  } else if (requestType === "Resign") {
    title = "<:Yellow:1421387900800729132> Resigned";
    color = 0xf1c40f;
    description = [
      `**Discord ID:** ${discordId}`,
      `**IGN:** ${mention}`,
      `**Resigned From:** ${currentRank}`
    ].join("\n");
  }

  const embed = {
    title,
    color,
    description,
    timestamp: new Date()
  };

  const payload = {
    content: `<@${discordId}>`,
    embeds: [embed]
  };

  try {
    const results = await Promise.all(
      webhookURLs.map(url =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      )
    );

    if (results.every(r => r.ok)) {
      return res.json({ success: true, message: "✅ Request sent successfully!" });
    } else {
      return res.status(500).json({ success: false, message: "❌ Some webhooks failed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "⚠️ Error sending request" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
