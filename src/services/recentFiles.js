const RECENT_FILES_KEY = 'markone_recent_files';

export function getRecentFiles() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

export function addToRecent(name, content, path = null) {
    if (name === 'Untitled.md') return;

    let files = getRecentFiles();

    // Check for absolute path vs just name
    const existingIndex = files.findIndex(f =>
        (path && f.path === path) || (!path && f.name === name)
    );

    if (existingIndex !== -1) {
        files.splice(existingIndex, 1);
    }

    // Limit snippet to 100 chars
    const snippet = content.substring(0, 100) + (content.length > 100 ? '...' : '');

    files.unshift({
        name,
        snippet,
        path: path || null, // null for browser, actual path for Electron
        timestamp: Date.now()
    });

    if (files.length > 10) {
        files = files.slice(0, 10);
    }

    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
}

export function clearRecentFiles() {
    localStorage.setItem(RECENT_FILES_KEY, '[]');
}
