(function () {
    console.log("Chat widget script version 1.1.0 loaded!");

    // Configuration Variables
    const API_BASE_URL = 'http://127.0.0.1:8002';  // Update if deployed
    const API_KEY = 'my_test_key';  // As per your current setup
    const WHATSAPP_NUMBER = '1234567890';  // Replace with your WhatsApp number
    const WHATSAPP_MESSAGE = encodeURIComponent("Hello, I would like to chat with you!");

    // Create the chat widget container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-widget';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '20px';
    chatContainer.style.right = '20px';
    chatContainer.style.width = '60px';
    chatContainer.style.height = '60px';
    chatContainer.style.backgroundColor = '#007bff';
    chatContainer.style.borderRadius = '50%';
    chatContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    chatContainer.style.display = 'flex';
    chatContainer.style.justifyContent = 'center';
    chatContainer.style.alignItems = 'center';
    chatContainer.style.cursor = 'pointer';
    chatContainer.style.zIndex = '1000';
    chatContainer.style.transition = 'width 0.3s, height 0.3s, border-radius 0.3s';
    chatContainer.style.overflow = 'hidden';

    // Chat icon
    const chatIcon = document.createElement('img');
    chatIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/chat.png';  // WhatsApp icon
    chatIcon.alt = 'Chat';
    chatIcon.style.width = '30px';
    chatIcon.style.height = '30px';
    chatContainer.appendChild(chatIcon);

    // Append chat container to the document body
    document.body.appendChild(chatContainer);

    // State to track if widget is open
    let isOpen = false;

    // Create the expanded chat view
    const expandedChat = document.createElement('div');
    expandedChat.style.position = 'absolute';
    expandedChat.style.bottom = '70px';
    expandedChat.style.right = '0';
    expandedChat.style.width = '300px';
    expandedChat.style.height = '400px';
    expandedChat.style.backgroundColor = '#fff';
    expandedChat.style.border = '1px solid #ccc';
    expandedChat.style.borderRadius = '8px';
    expandedChat.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    expandedChat.style.display = 'none';
    expandedChat.style.flexDirection = 'column';
    expandedChat.style.fontFamily = 'Arial, sans-serif';

    // Header of expanded chat
    const expandedHeader = document.createElement('div');
    expandedHeader.innerText = 'Chat Support';
    expandedHeader.style.backgroundColor = '#007bff';
    expandedHeader.style.color = '#fff';
    expandedHeader.style.padding = '10px';
    expandedHeader.style.fontWeight = 'bold';
    expandedHeader.style.textAlign = 'center';
    expandedHeader.style.cursor = 'pointer';
    expandedChat.appendChild(expandedHeader);

    // Chat body
    const chatBody = document.createElement('div');
    chatBody.style.flex = '1';
    chatBody.style.overflowY = 'auto';
    chatBody.style.padding = '10px';
    chatBody.style.backgroundColor = '#f9f9f9';
    expandedChat.appendChild(chatBody);

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.padding = '10px';
    inputContainer.style.borderTop = '1px solid #ccc';
    expandedChat.appendChild(inputContainer);

    // Text input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Type a message...';
    inputField.style.flex = '1';
    inputField.style.padding = '8px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.borderRadius = '4px';
    inputContainer.appendChild(inputField);

    // Send button
    const sendButton = document.createElement('button');
    sendButton.innerText = 'Send';
    sendButton.style.padding = '8px 12px';
    sendButton.style.marginLeft = '10px';
    sendButton.style.backgroundColor = '#007bff';
    sendButton.style.color = '#fff';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '4px';
    sendButton.style.cursor = 'pointer';
    inputContainer.appendChild(sendButton);

    // Append expanded chat to chat container
    chatContainer.appendChild(expandedChat);

    // Toggle chat widget open/close
    chatContainer.onclick = function () {
        if (!isOpen) {
            chatContainer.style.width = '300px';
            chatContainer.style.height = '400px';
            chatContainer.style.borderRadius = '8px';
            expandedChat.style.display = 'flex';
            isOpen = true;
            console.log("Chat widget opened.");
            addInitialPrompt();
        } else {
            chatContainer.style.width = '60px';
            chatContainer.style.height = '60px';
            chatContainer.style.borderRadius = '50%';
            expandedChat.style.display = 'none';
            isOpen = false;
            console.log("Chat widget closed.");
        }
    };

    // Function to add initial prompt
    function addInitialPrompt() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.innerText = 'Welcome! Click below to continue the conversation on WhatsApp.';
        welcomeMessage.style.marginBottom = '20px';
        welcomeMessage.style.color = '#333';
        chatBody.appendChild(welcomeMessage);

        // WhatsApp Button
        const whatsappButton = document.createElement('button');
        whatsappButton.innerText = 'Chat on WhatsApp';
        whatsappButton.style.padding = '10px 20px';
        whatsappButton.style.backgroundColor = '#25D366';
        whatsappButton.style.color = '#fff';
        whatsappButton.style.border = 'none';
        whatsappButton.style.borderRadius = '4px';
        whatsappButton.style.cursor = 'pointer';
        whatsappButton.style.fontSize = '16px';
        whatsappButton.onclick = function () {
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank');
            console.log("Redirected to WhatsApp.");
        };
        chatBody.appendChild(whatsappButton);
    }

    // Handle sending messages
    sendButton.onclick = function () {
        const message = inputField.value.trim();
        if (message) {
            console.log("User sent message:", message);
            addMessageToChat(message, 'user');
            inputField.value = '';
            if (message.toLowerCase() === '/lead') {
                console.log("Detected '/lead' command.");
                promptForLead();
            } else {
                sendMessageToBackend(message);
            }
        }
    };

    // Allow sending messages with Enter key
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

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

    // Function to prompt for lead information
    function promptForLead() {
        const leadInfo = prompt("Please enter your contact information (e.g., email):");
        console.log("Lead info entered:", leadInfo);
        if (leadInfo) {
            addMessageToChat(leadInfo, 'user');
            sendLeadToBackend(leadInfo);
        } else {
            console.log("No lead information entered.");
        }
    }

    // Function to send lead information to the back end
    function sendLeadToBackend(contactInfo) {
        console.log("Sending lead info to backend:", contactInfo);
        fetch(`${API_BASE_URL}/api/lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY  // Using 'my_test_key' as per context
            },
            body: JSON.stringify({ contact_info: contactInfo })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received response from /api/lead:", data);
                addMessageToChat(data.message, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('Error capturing lead.', 'bot');
            });
    }

    // Function to send message to the back end
    function sendMessageToBackend(message) {
        console.log("Sending message to backend:", message);
        fetch(`${API_BASE_URL}/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY  // Using 'my_test_key' as per context
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received response from /api/message:", data);
                addMessageToChat(data.response, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('Error connecting to chat server.', 'bot');
            });
    }

})();
