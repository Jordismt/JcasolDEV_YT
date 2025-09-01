document.addEventListener("DOMContentLoaded", () => {
    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
  
    // Mostrar / ocultar chatbot
    chatbotIcon.addEventListener("click", () => {
      chatbotWindow.classList.toggle("hidden");
    });
  
    // Enviar mensaje
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  
    function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
  
      addMessage(message, "user");
      userInput.value = "";
  
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
        .then(res => res.json())
        .then(data => {
          addMessage(data.reply, "bot");
        });
    }
  
    function addMessage(text, sender) {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message", sender);
      msgDiv.textContent = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  