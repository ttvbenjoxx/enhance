document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const sendPromptBtn = document.getElementById('send-prompt-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const responseDiv = document.getElementById('response');

  promptInput.focus();

  sendPromptBtn.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    if (prompt) {
      handleCommandOrSendPrompt(prompt);
    }
  });

  cancelBtn.addEventListener('click', () => {
    window.close();
  });

  promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendPromptBtn.click();
    }
  });

  function handleCommandOrSendPrompt(prompt) {
    // Check if the input is a command
    if (prompt.startsWith('//cmd/')) {
      const command = prompt.slice(6).toLowerCase(); // Extract command after "//cmd/"
      executeCommand(command);
    } else {
      sendPrompt(prompt);
    }
  }

  function executeCommand(command) {
    switch (command) {
      case 'back':
        window.open('../cmd/cmd.html', 'cmd', 'width=250,height=200');
        window.close();
        break;
      case 'close':
        window.close();
        break;
      case 'notepad':
        window.open('../notepad/notepad.html', 'notepad', 'width=600,height=400');
        window.close();
        break;
      case 'clear':
        promptInput.value = '';
        responseDiv.textContent = '';
        break;
      default:
        alert('Unknown command: ' + command);
    }
  }

  async function sendPrompt(prompt) {
    console.debug('Sending prompt to AI:', prompt);
    responseDiv.classList.add('hidden');
    responseDiv.textContent = 'Loading...';
    responseDiv.classList.remove('hidden');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: "system", content: "You are an assistant called Tantler." },
            { role: "user", content: prompt },
          ],
          max_tokens: 300,
        }),
      });

      console.debug('Received response from AI');
      const data = await response.json();
      console.debug('AI response data:', data);
      if (response.ok) {
        if (data.choices && data.choices.length > 0) {
          displayResponse(prompt, data.choices[0].message.content.trim());
        } else {
          console.error('Error: No choices in response from AI.');
          displayResponse(prompt, 'Error: No response from AI.');
        }
      } else {
        console.error('Error: ' + data.error.message);
        displayResponse(prompt, 'Error: ' + data.error.message);
      }
    } catch (err) {
      console.error('Error sending prompt to AI:', err);
      displayResponse(prompt, 'Error: ' + err.message);
    }
  }

  function displayResponse(prompt, response) {
    promptInput.value = ''; // Clear the input
    responseDiv.textContent = `You: ${prompt}\nTantler: ${response}`;

    // Dynamically adjust the height of the popup
    adjustPopupHeight();
  }

  function adjustPopupHeight() {
    const containerHeight = document.body.scrollHeight;
    const newHeight = containerHeight + 40; // Add some padding for comfort
    window.resizeTo(window.outerWidth, newHeight);

    // Enable scrolling if content still exceeds the popup height
    if (containerHeight > window.innerHeight) {
      document.body.style.overflowY = 'scroll';
    } else {
      document.body.style.overflowY = 'hidden';
    }
  }
});
