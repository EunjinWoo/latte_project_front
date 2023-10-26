
const chatMessages = document.querySelector('#chat-messages');
const userInput = document.querySelector('#user-input input');
const sendButton = document.querySelector('#user-input button');
const apiKey = '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';
const apiEndpoint = 'https://api.openai.com/v1/chat/completions'




function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.prepend(messageElement);

    console.log(messageElement);
}



async function fetchAIResponse(prompt) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  
            messages: [{
                role: "user", 
                content: prompt 
            }, ],
            temperature: 0.8,
            max_tokens: 1024, 
            top_p: 1,
            frequency_penalty: 0.5, 
            presence_penalty: 0.5, 
            stop: ["End"], 
        }),
    };
    
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
		console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    }
}



sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    console.log(message);
    if (message.length === 0) return;
    addMessage('나', message);
    userInput.value = '';
    const aiResponse = await fetchAIResponse(message);
    addMessage('챗봇', aiResponse);
});

userInput.addEventListener('keyup', (event) => { 
    if (event.key === 'Enter') {
        sendButton.click();
    }
});