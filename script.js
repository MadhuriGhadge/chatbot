document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotLabel = document.getElementById("chatbot-label");
    const chatPanel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    let faqData = [];

    // Load FAQs from JSON (If it fails, check for CORS issues)
    fetch("faq.json")  // If not working, rename faq.json to faq.txt and change this
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load FAQ data");
            }
            return response.json();
        })
        .then(data => {
            faqData = data.faqs;
            console.log("FAQ Data Loaded Successfully:", faqData); // Debugging
        })
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

    // 🔹 Improved Fuzzy Matching for Better Responses
    function getBotResponse(userText) {
        userText = userText.toLowerCase().trim();

        let bestMatch = null;
        let maxMatchScore = 0;

        for (let faq of faqData) {
            let question = faq.question.toLowerCase().trim();

            // Exact Match (100% Match)
            if (userText === question) {
                return faq.answer;
            }

            // Partial Match (Check if user input contains key words)
            let matchScore = getMatchScore(userText, question);
            if (matchScore > maxMatchScore) {
                maxMatchScore = matchScore;
                bestMatch = faq;
            }
        }

        return maxMatchScore > 0.5 ? bestMatch.answer : "I'm sorry, I couldn't find an answer for that.";
    }

    // 🔹 Function to Calculate Similarity Between Two Strings
    function getMatchScore(input, question) {
        let inputWords = input.split(" ");
        let questionWords = question.split(" ");
        let matchCount = inputWords.filter(word => questionWords.includes(word)).length;
        return matchCount / questionWords.length;
    }

    function addMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
