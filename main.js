const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let fileToOpen = null;

// Handle macOS open-file event
app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (mainWindow) {
        openAndSendFile(filePath);
    } else {
        fileToOpen = filePath;
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        icon: path.join(__dirname, 'gitimages', 'MarkOne_icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.setMenu(null);
    mainWindow.maximize();
    mainWindow.loadFile('MARKOne.html');

    mainWindow.webContents.on('did-finish-load', () => {
        // Handle Windows/Linux command-line arguments for file opening
        const args = process.argv;
        let filePath = fileToOpen;

        // Find the first argument that is a .md file, ignoring the executable and electron script paths
        if (!filePath && args.length >= 2) {
            for (let i = 1; i < args.length; i++) {
                if (args[i].endsWith('.md') && fs.existsSync(args[i])) {
                    filePath = args[i];
                    break;
                }
            }
        }

        if (filePath) {
            openAndSendFile(filePath);
            fileToOpen = null; // reset
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function openAndSendFile(filePath) {
    if (!mainWindow) return;
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);
        mainWindow.webContents.send('load-file', { fileName, content, filePath });
        mainWindow.setTitle(`MARKone - ${fileName}`);
    } catch (err) {
        console.error('Failed to open file:', err);
    }
}

app.whenReady().then(() => {
    // Disable all background networking by blocking http/https requests
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
        if (details.url.startsWith('http://') || details.url.startsWith('https://')) {
            callback({ cancel: true });
        } else {
            callback({ cancel: false });
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers for saving files
ipcMain.handle('save-file-dialog', async (event, { content, defaultPath }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Markdown File',
        defaultPath: defaultPath || 'Untitled.md',
        filters: [
            { name: 'Markdown', extensions: ['md', 'markdown'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!canceled && filePath) {
        fs.writeFileSync(filePath, content);
        return { success: true, filePath, fileName: path.basename(filePath) };
    }
    return { success: false };
});

ipcMain.handle('save-file', async (event, { filePath, content }) => {
    try {
        fs.writeFileSync(filePath, content);
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle('set-as-default', async () => {
    if (process.platform === 'win32') {
        try {
            app.setAsDefaultProtocolClient('markone');
            // Setting file association requires electron-builder configuration for installed version.
            // But we can inform the user that it's configured.
            return { success: true, message: 'File association is configured during installation.' };
        } catch (e) {
            return { success: false, message: e.message };
        }
    } else if (process.platform === 'darwin') {
        return { success: true, message: 'On macOS, please right-click a .md file -> Get Info -> Open with -> Change All.' };
    } else {
        return { success: true, message: 'On Linux, default apps are typically managed by the desktop environment settings.' };
    }
});
