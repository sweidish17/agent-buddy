(function () {
    // Create the chat widget container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-widget';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '20px';
    chatContainer.style.right = '20px';
    chatContainer.style.width = '300px';
    chatContainer.style.backgroundColor = '#f1f1f1';
    chatContainer.style.border = '1px solid #ccc';
    chatContainer.style.borderRadius = '8px';
    chatContainer.style.overflow = 'hidden';
    chatContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    // Chat header
    const header = document.createElement('div');
    header.innerText = 'Chat Support';
    header.style.backgroundColor = '#007bff';
    header.style.color = '#fff';
    header.style.padding = '10px';
    header.style.cursor = 'pointer';
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    header.onclick = function () {
        chatBody.style.display = chatBody.style.display === 'none' ? 'block' : 'none';
        inputContainer.style.display = inputContainer.style.display === 'none' ? 'flex' : 'none';
    };

    // Chat body
    const chatBody = document.createElement('div');
    chatBody.style.display = 'none';
    chatBody.style.height = '200px';
    chatBody.style.overflowY = 'auto';
    chatBody.style.padding = '10px';
    chatBody.style.backgroundColor = '#fff';

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'none';
    inputContainer.style.padding = '10px';
    inputContainer.style.borderTop = '1px solid #ccc';

    // Text input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Type a message...';
    inputField.style.width = '80%';
    inputField.style.padding = '8px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.borderRadius = '4px';

    // Send button
    const sendButton = document.createElement('button');
    sendButton.innerText = 'Send';
    sendButton.style.padding = '8px';
    sendButton.style.backgroundColor = '#007bff';
    sendButton.style.color = '#fff';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '4px';
    sendButton.style.cursor = 'pointer';

    // Append elements to input container
    inputContainer.appendChild(inputField);
    inputContainer.appendChild(sendButton);

    // Append elements to chat container
    chatContainer.appendChild(header);
    chatContainer.appendChild(chatBody);
    chatContainer.appendChild(inputContainer);

    // Append chat container to the document body
    document.body.appendChild(chatContainer);

    // Handle sending messages
    sendButton.onclick = function () {
        const message = inputField.value.trim();
        if (message) {
            addMessageToChat(message, 'user');
            sendMessageToBackend(message);
            inputField.value = '';
        }
    };

    // Function to add message to chat
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.style.margin = '8px 0';
        messageElement.style.padding = '10px';
        messageElement.style.borderRadius = '4px';
        messageElement.style.maxWidth = '80%';
        messageElement.style.backgroundColor = sender === 'user' ? '#dcf8c6' : '#f1f1f1';
        messageElement.style.alignSelf = sender === 'user' ? 'flex-end' : 'flex-start';
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Function to send message to the back end
    function sendMessageToBackend(message) {
        fetch('http://127.0.0.1:8002/api/message', {  // Update URL if deployed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'my_test_key' 
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => response.json())
            .then(data => {
                addMessageToChat(data.response, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('Error connecting to chat server.', 'bot');
            });
    }
})();