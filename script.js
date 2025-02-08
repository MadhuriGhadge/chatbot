document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotLabel = document.getElementById("chatbot-label");
    const chatPanel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    let faqData = [];

    // Load FAQs from JSON
    fetch("faq.json")
        .then(response => response.json())
        .then(data => faqData = data.faqs)
        .catch(error => console.error("Error loading FAQ:", error));

    // Open chatbot and hide label
    chatbotBtn.addEventListener("click", () => {
        chatPanel.style.display = "flex";
        chatbotLabel.classList.add("hide-label");
    });

    // Close chatbot panel
    closeBtn.addEventListener("click", () => {
        chatPanel.style.display = "none";
    });

    // Send message on button click or Enter key
    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleUserMessage();
    });

    async function handleUserMessage() {
        let userText = userInput.value.trim();
        if (!userText) return;

        addMessage("You: " + userText, "user");
        userInput.value = "";

        setTimeout(async () => {
            let botResponse = await getBotResponse(userText);
            addMessage("Bot: " + botResponse, "bot");
        }, 500);
    }

    async function getBotResponse(userText) {
        let faqAnswer = checkFAQ(userText);
        if (faqAnswer) {
            return faqAnswer; // Return predefined response if a match is found in FAQ
        } else {
            return await getChatbotResponse(userText); // 🔹 Now uses Cloudflare Worker for all API calls
        }
    }

    function checkFAQ(userText) {
        userText = normalizeText(userText);

        for (let faq of faqData) {
            let question = normalizeText(faq.question);
            let pattern = new RegExp("\\b" + question.replace(/\s+/g, "\\b.*\\b") + "\\b", "i");
            if (pattern.test(userText)) {
                return faq.answer;
            }
        }
        return null; // Return null if no match is found
    }

    // 🔹 Fetch response from Cloudflare Worker (which securely calls Gemini API)
    async function getChatbotResponse(userText) {
        const response = await fetch("https://raspy-hat-ee9d.ghadgemadhuri92.workers.dev/", {  
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userText })
        });

        const data = await response.json();
        return data.answer;
    }

    function normalizeText(text) {
        return text.toLowerCase().trim().replace(/([a-z])\1+/g, "$1");
    }

    function addMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
