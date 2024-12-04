document.addEventListener('DOMContentLoaded', () => {
  const activateBtn = document.getElementById('activate-btn');
  const deactivateBtn = document.getElementById('deactivate-btn');
  const statusDiv = document.getElementById('status');

  let shiftPressedOnce = false;
  let tantlerActive = false;
  let popup;

  const updateStatus = (status) => {
    statusDiv.textContent = `Tantler Status: ${status}`;
  };

  const openCmdCenter = () => {
    // Update the path to open cmd.html from the cmd folder
    popup = window.open('./cmd/cmd.html', 'cmd', 'width=250,height=200');
    if (!popup) {
      alert('Please allow pop-ups for this site to use the Tantler Assistant.');
    }
  };

  async function sendPrompt(prompt) {
    console.debug('Sending prompt to AI:', prompt);
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
          return data.choices[0].message.content.trim();
        } else {
          console.error('Error: No choices in response from AI.');
          return 'Error: No response from AI.';
        }
      } else {
        console.error('Error: ' + data.error.message);
        return 'Error: ' + data.error.message;
      }
    } catch (err) {
      console.error('Error sending prompt to AI:', err);
      return 'Error: ' + err.message;
    }
  }

  window.sendPrompt = sendPrompt;

  activateBtn.addEventListener('click', () => {
    tantlerActive = true;
    updateStatus('On standby');
    activateBtn.classList.add('hidden');
    deactivateBtn.classList.remove('hidden');
  });

  deactivateBtn.addEventListener('click', () => {
    tantlerActive = false;
    updateStatus('Off');
    activateBtn.classList.remove('hidden');
    deactivateBtn.classList.add('hidden');
  });

  document.addEventListener('keydown', (event) => {
    if (!tantlerActive) return;

    if (event.key === 'Shift') {
      if (shiftPressedOnce) {
        openCmdCenter(); // Opens the command center instead of the Tantler assistant
        shiftPressedOnce = false;
        updateStatus('Activated');
        // Show a browser notification to remind the user to switch back to the tab
        if (Notification.permission === 'granted') {
          new Notification('Tantler Activated', {
            body: 'Switch back to the Tantler tab to use the assistant.',
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Tantler Activated', {
                body: 'Switch back to the Tantler tab to use the assistant.',
              });
            }
          });
        }
      } else {
        shiftPressedOnce = true;
        setTimeout(() => {
          shiftPressedOnce = false;
        }, 300);
      }
    }
  });

  // Prompt the user to allow pop-ups when the site is first opened
  setTimeout(() => {
    if (!popup) {
      openCmdCenter();
      if (!popup) {
        alert('Please allow pop-ups for this site to use the Tantler Assistant.');
      } else {
        popup.close();
      }
    }
  }, 1000);
});
