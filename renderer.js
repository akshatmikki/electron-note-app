const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
  const notesList = document.getElementById('notesList');
  const noteContent = document.getElementById('noteContent');
  const saveButton = document.getElementById('saveButton');

  let notesArray = await ipcRenderer.invoke('get-notes');
 
  function loadNotes() {
    notesList.innerHTML = ''; 
    notesArray.forEach((note, index) => addNoteToList(note, index));
  }

  loadNotes();

  saveButton.addEventListener('click', async () => {
    const content = noteContent.value.trim();

    if (content && !notesArray.includes(content)) {
      await ipcRenderer.invoke('save-note', content);
      notesArray.push(content); 
      addNoteToList(content, notesArray.length - 1); 
      noteContent.value = '';
    }
  });

  function addNoteToList(note, index) {
    const li = document.createElement('li');
    li.textContent = note;
    li.dataset.index = index;
    li.addEventListener('click', () => {
      noteContent.value = note;
    });
    notesList.appendChild(li);
  }
});
