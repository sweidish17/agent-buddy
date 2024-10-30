// Chat Widget JavaScript

const chatContainer = document.getElementById('chat-container');
const chatHeader = document.getElementById('chat-header');
const whatsappNumberInput = document.getElementById('whatsapp-number');
const startChatButton = document.getElementById('start-whatsapp-chat');
let isOpen = false;

// Function to toggle the chat widget
chatContainer.onclick = function (event) {
  // Prevent the click from propagating to child elements
  if (event.target === chatContainer || event.target === chatHeader) {
    if (!isOpen) {
      // Open the chat widget
      chatContainer.classList.add('open');
      isOpen = true;
      console.log("Chat widget opened.");
    } else {
      // Close the chat widget
      chatContainer.classList.remove('open');
      isOpen = false;
      console.log("Chat widget closed.");
    }
  }
};

// Handle WhatsApp number submission
startChatButton.onclick = function (event) {
  event.stopPropagation(); // Prevent the widget from closing when clicking the button
  const whatsappNumber = whatsappNumberInput.value.trim();
  if (whatsappNumber) {
    // Send the number to the backend
    fetch('http://localhost:8002/api/start_whatsapp_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'my_test_key' // Replace with your actual API key
      },
      body: JSON.stringify({ whatsapp_number: whatsappNumber })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          throw new Error(data.detail || 'Unknown error');
        });
      }
    })
    .then(data => {
      alert('A WhatsApp message has been sent to your number. Please check your WhatsApp to continue the chat.');
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });
  } else {
    alert('Please enter a valid WhatsApp number.');
  }
};
