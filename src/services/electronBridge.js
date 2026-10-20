export const electronBridge = {
    get isElectron() {
        return !!window.electronAPI;
    },

    async saveFile(filePath, content) {
        if (!this.isElectron) return { success: false, error: 'Not in Electron' };
        return await window.electronAPI.saveFile({ filePath, content });
    },

    async saveFileDialog(content, defaultPath) {
        if (!this.isElectron) return { success: false, error: 'Not in Electron' };
        return await window.electronAPI.saveFileDialog({ content, defaultPath });
    },

    async setAsDefault() {
        if (!this.isElectron) return { success: false, error: 'Not in Electron' };
        return await window.electronAPI.setAsDefault();
    },

    onLoadFile(callback) {
        if (this.isElectron) {
            window.electronAPI.onLoadFile(callback);
        }
    }
};
