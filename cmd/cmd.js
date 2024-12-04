document.addEventListener('DOMContentLoaded', () => {
  const notepadBtn = document.getElementById('notepad-btn');
  const tantlerBtn = document.getElementById('tantler-btn');

  notepadBtn.addEventListener('click', () => {
    // Open the notepad located in the notepad directory
    window.open('../notepad/notepad.html', 'notepad', 'width=600,height=400');
    window.close();
  });

  tantlerBtn.addEventListener('click', () => {
    // Open the assistant located in the assistant directory
    window.open('../assistant/assistant.html', 'tantler', 'width=400,height=400');
    window.close();
  });
});
