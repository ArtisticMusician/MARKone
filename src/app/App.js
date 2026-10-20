import styles from './App.module.css';
import { renderToast } from '../components/Toast/Toast.js';

import { renderEditor } from '../components/Editor/Editor.js';
import { renderPreview } from '../components/Preview/Preview.js';
import { renderToolbar } from '../components/Toolbar/Toolbar.js';
import { renderCheatsheet } from '../components/Cheatsheet/Cheatsheet.js';
import { renderSettings } from '../components/Settings/Settings.js';
import { renderFindReplace } from '../components/FindReplace/FindReplace.js';

export default function App() {
    return `
        <div class="${styles.container} bg-primary">
            <!-- Toolbar will go here -->
            <div id="toolbar-container">
                ${renderToolbar()}
            </div>

            <div class="flex-1 flex overflow-hidden">
                <!-- Editor will go here -->
                <div id="editor-container" class="w-1/2 flex flex-col border-r border-color">
                    ${renderEditor()}
                </div>

                <!-- Preview will go here -->
                <div id="preview-container" class="w-1/2 flex flex-col bg-primary">
                    ${renderPreview()}
                </div>
            </div>

            ${renderToast()}
            <!-- Modals will go here -->
            ${renderCheatsheet()}
            ${renderSettings()}
            ${renderFindReplace()}
        </div>
    `;
}
