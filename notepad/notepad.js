document.addEventListener('DOMContentLoaded', () => {
  const notepadEditor = document.getElementById('notepad-editor');

  // Load the content from localStorage
  const savedContent = localStorage.getItem('notepadContent');
  if (savedContent) {
    notepadEditor.innerHTML = savedContent;
  }

  notepadEditor.focus();

  // Save the content to localStorage whenever it changes
  notepadEditor.addEventListener('input', () => {
    localStorage.setItem('notepadContent', notepadEditor.innerHTML);
  });

  // Handle Enter key behavior and command detection
  notepadEditor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      const text = notepadEditor.innerText.trim();
      const commandPattern = /^\/\/cmd\/([a-zA-Z]+)$/; // Regex to match //cmd/command
      const match = text.match(commandPattern);

      if (match) {
        const command = match[1].toLowerCase();
        handleCommand(command);
      } else {
        document.execCommand('insertHTML', false, '<br><br>');
      }
    }
  });

  function handleCommand(command) {
    switch (command) {
      case 'tantler':
        saveAndExecute(() => {
          window.open('../assisstant/assisstant.html', 'tantler', 'width=400,height=400');
          window.close();
        });
        break;
      case 'close':
        saveAndExecute(() => {
          window.close();
        });
        break;
      case 'back':
        saveAndExecute(() => {
          window.open('../cmd/cmd.html', 'cmd', 'width=250,height=200');
          window.close();
        });
        break;
      default:
        alert('Unknown command: ' + command);
    }
  }

  function saveAndExecute(action) {
    // Save current content
    localStorage.setItem('notepadContent', notepadEditor.innerHTML);

    // Clear the editor
    notepadEditor.innerHTML = '';

    // Execute the provided action
    action();
  }
});
