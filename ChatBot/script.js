// Function to create a new chat message element
/**
 * Creates a new chat message element with the given text and sender.
 * @param {string} text - The text of the chat message.
 * @param {string} sender - The sender of the chat message.
 * @returns {HTMLElement} The chat message element.
 */
// Get the chat form and input elements
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('input_text');
const chatHistory = document.getElementById('chat-history');

// Function to create a new chat message element
function createChatMessage(text, sender) {
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');

    const senderElement = document.createElement('strong');
    senderElement.textContent = `${sender}:`;
    chatMessage.appendChild(senderElement);

    const textNode = document.createTextNode(` ${text}`);
    chatMessage.appendChild(textNode);

    return chatMessage;
}

// Function to animate chat messages
function animateChatMessage(message) {
    message.style.opacity = 0;
    message.style.transform = 'translateY(20px)';
    setTimeout(() => {
        message.style.opacity = 1;
        message.style.transform = 'translateY(0)';
    }, 100);
}

// Add an event listener to the chat form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = chatInput.value.trim();
    if (inputText !== '') {
        // Create a new chat message element
        const chatMessage = createChatMessage(inputText, 'You');
        chatHistory.appendChild(chatMessage);
        animateChatMessage(chatMessage);
        chatInput.value = '';

        // Send the input text to the server using AJAX
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input_text: inputText })
        })
        .then(response => response.json())
        .then(data => {
            const responseMessage = createChatMessage(data.response, 'Bot');
            chatHistory.appendChild(responseMessage);
            animateChatMessage(responseMessage);
        })
        .catch(error => console.error(error));
    }
});