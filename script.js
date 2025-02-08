document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatPanel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    let faqData = [];
    let firstClick = true;

    // Load FAQs from JSON
    fetch("faq.txt")
        .then(response => response.json())
        .then(data => faqData = data.faqs)
        .catch(error => console.error("Error loading FAQ:", error));

    chatbotBtn.addEventListener("click", () => {
        chatPanel.style.display = "flex";

        if (firstClick) {
            addMessage("Hi, I'm CampusMate!", "bot");
            firstClick = false;
        }
    });

    closeBtn.addEventListener("click", () => chatPanel.style.display = "none");

    sendBtn.addEventListener("click", handleUserMessage);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleUserMessage();
    });

    function handleUserMessage() {
        let userText = normalizeText(userInput.value.trim());
        if (!userText) return;

        addMessage("You: " + userText, "user");
        userInput.value = "";

        setTimeout(() => addMessage("Bot: " + getBotResponse(userText), "bot"), 500);
    }

    function getBotResponse(userText) {
        for (let faq of faqData) {
            let question = normalizeText(faq.question);
            let pattern = new RegExp("\\b" + question.replace(/\s+/g, "\\b.*\\b") + "\\b", "i");
            if (pattern.test(userText)) return faq.answer;
        }
        return "I'm sorry, I couldn't find an answer for that.";
    }

    function normalizeText(text) {
        return text.toLowerCase().trim().replace(/([a-z])\1+/g, "$1");
    }

    function addMessage(text, sender, isImage = false) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
    
        if (isImage) {
            let img = document.createElement("img");
            img.src = chatbot.jpg; 
            img.style.maxWidth = "100%"; 
            img.style.borderRadius = "10px";
            messageDiv.appendChild(img);
        } else {
            messageDiv.textContent = text;
        }
    
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to latest message
    }
});
