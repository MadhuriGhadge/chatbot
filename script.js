document.addEventListener("DOMContentLoaded", async function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatPanel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    let faqData = [];

    // 🔹 Fetch FAQs from JSONBin
    async function fetchFAQs() {
        try {
            const response = await fetch("https://api.jsonbin.io/v3/b/67a84252e41b4d34e486e8c9"); // ✅ Public bin (No API key needed)

            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Fetched FAQs:", data.record.faqs); // Debugging
            faqData = data.record.faqs;
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    }

    await fetchFAQs(); // Load FAQs on startup

    chatbotBtn.addEventListener("click", () => chatPanel.style.display = "flex");
   closeBtn.addEventListener("click", () => {
    chatPanel.style.display = "none";  // Hide chat panel
    chatBody.innerHTML = "";  // Clear previous messages
});

    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", e => { if (e.key === "Enter") handleUserMessage(); });

    async function handleUserMessage() {
        let userText = userInput.value.trim();
        if (!userText) return;

        addMessage("You: " + userText, "user");
        userInput.value = "";

        setTimeout(() => {
            let botResponse = checkFAQ(userText);
            if (!botResponse) {
                botResponse = "I'm sorry, I couldn't find an answer.Kindly visit https://kthmcollege.ac.in/department-computer-science/profile";
            }
            addMessage("Bot: " + botResponse, "bot");
        }, 500);
    }

    // 🔹 Use Fuzzy Matching (Fuse.js) for FAQ lookup
    function checkFAQ(userText) {
        if (!faqData.length) return null;

        const options = {
            keys: ["question"],
            threshold: 0.4,
            includeScore: true
        };

        let fuse = new Fuse(faqData, options);
        let result = fuse.search(userText);

        console.log("Search result:", result); // Debugging

        if (result.length > 0) {
            return result[0].item.answer;
        }
        return null;
    }

    function addMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        console.log("Added message:", text); // Debugging
    }
});
