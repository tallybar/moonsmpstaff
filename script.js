// WARNING: Client-side only – whitelist and secrets are visible! Not secure for public use.
// Add your IP(s) to allowedIPs below (find yours at ipify.org).
// Change the password and webhook URLs as needed.

const correctPassword = "iamgay"; // CHANGE THIS!

const webhookURLs = [
    "https://discord.com/api/webhooks/1421382701734301726/Mf7VZtePkcAapEEbj16bxdJY5w_bX1-ALHreKTMKcxV3VhN14_hKI_8AxyITrAHB4PHj",
    "https://discord.com/api/webhooks/YOUR_SECOND_WEBHOOK_URL_HERE" // Replace with real URL or remove
].filter(url => url.includes('discord.com')); // Skip placeholders

const allowedIPs = [
    '27.34.73.13', // e.g., '123.45.67.89' – Add your actual IPv4 address(es) here. Multiple? Use: ['IP1', 'IP2']
    // Example: '192.168.1.100', '8.8.8.8'
];

const loadingScreen = document.getElementById('loadingScreen');
const formContainer = document.getElementById('formContainer');
const ipInfo = document.getElementById('ipInfo');

const REDIRECT_URL = 'https://discord.gg/moonsmp'; // Redirect destination

// Function to check IP and show/hide form (strict: redirect on mismatch or error)
async function checkIPAccess() {
    try {
        // Fetch user's public IP from ipify.org (free API)
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('API response not OK');
        }
        const data = await response.json();
        const userIP = data.ip;

        console.log(`Detected IP: ${userIP}`); // Debug log

        // Check if IP is allowed (exact string match)
        if (allowedIPs.includes(userIP)) {
            // Allowed: Show form
            console.log(`Access allowed for IP: ${userIP}`);
            loadingScreen.style.display = 'none';
            formContainer.style.display = 'block';
            formContainer.style.opacity = '1';
            ipInfo.textContent = `Access granted for IP: ${userIP}`;
            initForm(); // Initialize form logic
        } else {
            // Not allowed: Show brief denial message, then redirect
            console.log(`Access denied for IP: ${userIP}. Redirecting to ${REDIRECT_URL}`);
            loadingScreen.innerHTML = '<h2>Access Denied</h2><p>Your IP is not authorized. Redirecting...</p>';
            setTimeout(() => {
                window.location.href = REDIRECT_URL;
            }, 1500); // 1.5s delay for user to see message
        }
    } catch (error) {
        // API/Network error: Strictly redirect (no fallback access)
        console.warn('IP check failed:', error);
        console.log(`Error occurred. Redirecting to ${REDIRECT_URL}`);
        loadingScreen.innerHTML = '<h2>Access Check Failed</h2><p>Unable to verify IP. Redirecting...</p>';
        setTimeout(() => {
            window.location.href = REDIRECT_URL;
        }, 1500); // 1.5s delay
    }
}

// Form initialization (same as before – only runs if IP allowed)
function initForm() {
    const form = document.getElementById("rankForm");
    const submitBtn = document.getElementById("submitBtn");
    const discordInput = document.getElementById("discordId");
    const discordError = document.getElementById("discordError");
    const passwordError = document.getElementById("passwordError");

    // Basic validation for Discord ID
    discordInput.addEventListener("input", function() {
        const value = this.value;
        const isValid = /^\d{17,19}$/.test(value);
        discordError.style.display = isValid || value === "" ? "none" : "block";
        toggleSubmit();
    });

    function toggleSubmit() {
        const isValidDiscord = /^\d{17,19}$/.test(discordInput.value);
        submitBtn.disabled = !isValidDiscord || !form.checkValidity();
    }

    form.addEventListener("input", toggleSubmit);

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const enteredPassword = document.getElementById("password").value;
        if (enteredPassword !== correctPassword) {
            passwordError.style.display = "block";
            document.getElementById("password").focus();
            return;
        }
        passwordError.style.display = "none";

        const formData = {
            requestType: document.getElementById("requestType").value,
            discordId: document.getElementById("discordId").value,
            mention: document.getElementById("mention").value,
            currentRank: document.getElementById("currentRank").value,
            updatedRank: document.getElementById("updatedRank").value,
            reason: document.getElementById("reason").value,
        };

        // Final Discord ID check
        if (!/^\d{17,19}$/.test(formData.discordId)) {
            discordError.style.display = "block";
            return;
        }

        // Pick title & color based on type
        let title = "";
        let color = 0x4f46e5;
        if (formData.requestType === "Promotion") {
            title = "<:Green:1421387917791854755> Promoted";
            color = 0x2ecc71;
        } else if (formData.requestType === "Demotion") {
            title = "<:Red:1421387876867768371> Demoted";
            color = 0xe74c3c;
        } else if (formData.requestType === "Resign") {
            title = "<:Yellow:1421387900800729132> Resigned";
            color = 0xf1c40f;
        }

        const embed = {
            title: title,
            color: color,
            description: `<:Info:1416786700746752162> **Discord ID:** ${formData.discordId}\n` +
                         `<:Info:1416786700746752162> **IGN:** ${formData.mention}\n` +
                         `<:Info:1416786700746752162> **From:** ${formData.currentRank}\n` +
                         `<:Info:1416786700746752162> **To:** ${formData.updatedRank}\n` +
                         `<:Info:1416786700746752162> **Reason:** ${formData.reason}`,
            timestamp: new Date().toISOString(),
        };

        const payload = {
            content: `<@${formData.discordId}>`, // Ping the user
            embeds: [embed],
        };

        // Disable button during send
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        // Send to all valid webhooks
        Promise.all(
            webhookURLs.map(url =>
                fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response;
                })
            )
        )
        .then(responses => {
            if (responses.length > 0) {
                alert("✅ Request sent successfully!");
                form.reset();
                discordError.style.display = "none";
            } else {
                alert("❌ No valid webhooks configured.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert(`⚠️ Error sending request: ${err.message}`);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Request";
        });
    });
}

// Start IP check on page load
document.addEventListener('DOMContentLoaded', checkIPAccess);
