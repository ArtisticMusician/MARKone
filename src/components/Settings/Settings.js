import { electronBridge } from '../../services/electronBridge.js';

export function renderSettings() {
    return `
    <div id="settingsModal" class="modal-bg fixed inset-0 z-50 flex items-center justify-center hidden" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);">
        <div class="modal-content border rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden flex flex-col bg-primary">
            <div class="flex items-center justify-between px-6 py-4 border-b border-color">
                <h2 class="text-xl font-bold">Settings</h2>
                <button id="closeSettingsBtn" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6 overflow-auto flex-1">
                <div class="mb-4">
                    <h3 class="font-bold mb-2">Default App</h3>
                    <p class="text-sm mb-3 text-secondary">Set MARKone as the default editor for .md files.</p>
                    <button id="setAsDefaultBtn" class="w-full py-2 px-4 bg-primary text-primary border border-color rounded hover:bg-secondary transition-colors">
                        Set as Default
                    </button>
                </div>
                <div class="border-t border-color my-4"></div>
                <div class="mb-4">
                    <h3 class="font-bold mb-2">About</h3>
                    <p class="text-sm text-secondary">MARKone v<span id="appVersion">1.0.5</span></p>
                    <p class="text-xs text-secondary mt-2">A simple, fast, and secure Markdown editor.</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

export function initSettings() {
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const defaultBtn = document.getElementById('setAsDefaultBtn');

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    defaultBtn.addEventListener('click', async () => {
        if (electronBridge.isElectron) {
            const result = await electronBridge.setAsDefault();
            alert(result.message || 'Action completed.');
        } else {
            alert("This feature is only available in the standalone desktop app.");
        }
    });

    window.showSettings = () => modal.classList.remove('hidden');
}
