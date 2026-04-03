const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

async function askAI(prompt) {
    const systemPrompt = "Ты — MettalAI. Отвечай ТОЛЬКО на русском языке. Будь полезным, дружелюбным. Не используй английские слова без необходимости.";

    const data = {
        model: "deepseek/deepseek-chat",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.choices && result.choices.length > 0) {
            return result.choices[0].message.content;
        } else {
            return "⚠️ Ошибка: не удалось получить ответ от нейросети.";
        }
    } catch (error) {
        console.error("Ошибка:", error);
        return "⚠️ Ошибка соединения. Попробуй позже.";
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="avatar">${sender === 'user' ? '👤' : '🤖'}</div>
        <div class="text">${escapeHtml(text)}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTyping() {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.style.display = 'none';
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    showTyping();

    const reply = await askAI(text);
    hideTyping();
    addMessage(reply, 'bot');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});