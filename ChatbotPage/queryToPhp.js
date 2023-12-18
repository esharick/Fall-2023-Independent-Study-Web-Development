const chatHistory = [
    "User: Hi there!",
    "Bot: Hello! How can I help you?",
    "User: I have a question...",
    "Bot: Sure, go ahead...",
];
const textInput = document.getElementById("text-input");
const chatTextArea = document.getElementById("chat-text-area");
window.onload = displayChatHistory;

function displayChatHistory() {
    chatTextArea.value = chatHistory.join("\n"); 
    chatTextArea.scrollTop = chatTextArea.scrollHeight; 
}

function displayResponse(response) {
    chatHistory.push("Bot: " + response);
    displayChatHistory();
}

function inputButtonClicked() {
    let userMessage = textInput.value;
    if (userMessage.trim() === "") {
        return;
    }
    textInput.innerHTML = "";

    console.log(userMessage);
    chatHistory.push("User: " + userMessage);
    displayChatHistory();
    sendMessageToPHP(userMessage);
}

function sendMessageToPHP(message) {
     // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response here
                var response = xhr.responseText;
                console.log(response);
                displayResponse(response);
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', 'gptAPIfake.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('message=' + message);
}
