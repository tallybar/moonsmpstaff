// Insecure: webhook URLs and password exposed in JS
const webhookURLs = [
  "YOUR_FIRST_DISCORD_WEBHOOK_URL",
  "YOUR_SECOND_DISCORD_WEBHOOK_URL"
];
const correctPassword = "iamgay"; // change this

document.getElementById("rankForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const requestType = document.getElementById("requestType").value;
  const discordId = document.getElementById("discordId").value;
  const mention = document.getElementById("mention").value;
  const currentRank = document.getElementById("currentRank").value;
  const updatedRank = document.getElementById("updatedRank").value;
  const reason = document.getElementById("reason").value;
  const password = document.getElementById("password").value;

  if (password !== correctPassword) {
    alert("❌ Incorrect password.");
    return;
  }

  let title = "";
  let description = "";

  if (requestType === "Promotion") {
    title = "✅ Promoted";
    description = `**Discord ID:** ${discordId}\n**IGN:** ${mention}\n**From:** ${currentRank}\n**To:** ${updatedRank}\n**Reason:** ${reason}`;
  } else if (requestType === "Demotion") {
    title = "❌ Demoted";
    description = `**Discord ID:** ${discordId}\n**IGN:** ${mention}\n**From:** ${currentRank}\n**To:** ${updatedRank}\n**Reason:** ${reason}`;
  } else if (requestType === "Resign") {
    title = "⚠️ Resigned";
    description = `**Discord ID:** ${discordId}\n**IGN:** ${mention}\n**Resigned From:** ${currentRank}`;
  }

  const payload = {
    content: `<@${discordId}>`,
    embeds: [{ title, description, timestamp: new Date() }]
  };

  try {
    // Send to both webhooks
    await Promise.all(webhookURLs.map(url =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    ));

    alert("✅ Request sent successfully to all webhooks!");
    document.getElementById("rankForm").reset();
  } catch (err) {
    console.error(err);
    alert("⚠️ Error sending request.");
  }
});
