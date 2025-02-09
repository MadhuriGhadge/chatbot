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
            const response = await fetch("https://api.jsonbin.io/v3/b/67a78913acd3cb34a8daa82a", {
                headers: { "X-Master-Key": "$2a$10$hv56tqI.vRgW3ni2rXn4XeIobmY/ZUbgDnR91CUf4fg9K3TWmPXom" }
            });

            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Fetched FAQs:", data.record.faqs);
            faqData = data.record.faqs;
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    }

    await fetchFAQs(); // Load FAQs on startup

    chatbotBtn.addEventListener("click", () => chatPanel.style.display = "flex");
    closeBtn.addEventListener("click", () => chatPanel.style.display = "none");
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
                botResponse = "I'm sorry, I couldn't find an answer.";
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
    }
});
