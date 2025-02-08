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
    fetch("faq.txt")
        .then(response => response.json())
        .then(data => faqData = data.faqs)
        .catch(error => console.error("Error loading FAQ:", error));

    // Open chatbot and hide label when clicked
    chatbotBtn.addEventListener("click", () => {
        chatPanel.style.display = "flex";
        chatbotLabel.classList.add("hide-label"); // Hide label on click
    });

    // Close chatbot
    closeBtn.addEventListener("click", () => {
        chatPanel.style.display = "none";
    });

    // Send message on button click or Enter key
    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleUserMessage();
    });

    function handleUserMessage() {
        let userText = userInput.value.trim();
        if (!userText) return;

        addMessage("You: " + userText, "user");
        userInput.value = "";

        setTimeout(() => {
            let botResponse = getBotResponse(userText);
            addMessage("Bot: " + botResponse, "bot");
        }, 500);
    }

    function getBotResponse(userText) {
        for (let faq of faqData) {
            if (userText.toLowerCase() === faq.question.toLowerCase()) {
                return faq.answer;
            }
        }
        return "I'm sorry, I couldn't find an answer for that.";
    }

    function addMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
