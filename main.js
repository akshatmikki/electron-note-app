const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const notesFilePath = path.join(__dirname, 'notes.json');

function loadNotes() {
  try {
    const data = fs.readFileSync(notesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

ipcMain.handle('get-notes', () => loadNotes());
ipcMain.handle('save-note', (event, note) => {
  const notes = loadNotes();
  notes.push(note);
  saveNotes(notes);
});
