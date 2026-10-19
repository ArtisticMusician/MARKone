import { electronBridge } from './electronBridge.js';

let currentHandle = null;
let electronFilePath = null;

export async function fileOpen() {
    if (electronBridge.isElectron) {
        // In electron, opening files is handled by main process, usually triggering the onLoadFile callback.
        // If we want a file open dialog initiated from renderer, we'd need an IPC call for it.
        // Currently MARKone uses drag/drop and recent files or double click.
        return null;
    }

    // Browser fallback
    try {
        if ('showOpenFilePicker' in window) {
            const [handle] = await window.showOpenFilePicker({
                types: [{ description: 'Markdown File', accept: { 'text/markdown': ['.md'] } }]
            });
            const file = await handle.getFile();
            const text = await file.text();
            currentHandle = handle;
            electronFilePath = null;
            return { name: file.name, content: text };
        } else {
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.md';
                input.onchange = e => {
                    const file = e.target.files[0];
                    if (!file) return resolve(null);
                    const reader = new FileReader();
                    reader.onload = e => {
                        currentHandle = null;
                        electronFilePath = null;
                        resolve({ name: file.name, content: e.target.result });
                    };
                    reader.readAsText(file);
                };
                input.click();
            });
        }
    } catch (err) {
        console.error('File open failed:', err);
        return null;
    }
}

export async function fileSave(content, defaultFileName, onSaveSuccess) {
    if (electronBridge.isElectron) {
        if (electronFilePath) {
            const result = await electronBridge.saveFile(electronFilePath, content);
            if (result.success) {
                if (onSaveSuccess) onSaveSuccess(defaultFileName, content, electronFilePath);
                return { success: true, name: defaultFileName, path: electronFilePath };
            }
            return { success: false, error: result.error };
        } else {
            return await fileSaveAs(content, defaultFileName, onSaveSuccess);
        }
    } else if (currentHandle) {
        try {
            const writable = await currentHandle.createWritable();
            await writable.write(content);
            await writable.close();
            if (onSaveSuccess) onSaveSuccess(defaultFileName, content, null);
            return { success: true, name: defaultFileName };
        } catch (err) {
            console.error('Save failed:', err);
            return { success: false, error: err.message };
        }
    } else {
        return await fileSaveAs(content, defaultFileName, onSaveSuccess);
    }
}

export async function fileSaveAs(content, defaultFileName, onSaveSuccess) {
    if (electronBridge.isElectron) {
        const result = await electronBridge.saveFileDialog(content, defaultFileName);
        if (result.success) {
            electronFilePath = result.filePath;
            if (onSaveSuccess) onSaveSuccess(result.fileName, content, electronFilePath);
            return { success: true, name: result.fileName, path: electronFilePath };
        }
        return { success: false, error: 'Cancelled or failed' };
    } else {
        try {
            if ('showSaveFilePicker' in window) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: defaultFileName,
                    types: [{ description: 'Markdown File', accept: { 'text/markdown': ['.md'] } }]
                });
                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
                currentHandle = handle;
                if (onSaveSuccess) onSaveSuccess(handle.name, content, null);
                return { success: true, name: handle.name };
            } else {
                const blob = new Blob([content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = defaultFileName;
                a.click();
                URL.revokeObjectURL(url);
                if (onSaveSuccess) onSaveSuccess(defaultFileName, content, null);
                return { success: true, name: defaultFileName };
            }
        } catch (err) {
            console.error('Save As failed:', err);
            return { success: false, error: err.message };
        }
    }
}

export function setCurrentFilePath(path) {
    electronFilePath = path;
}

export function getCurrentFilePath() {
    return electronFilePath;
}
