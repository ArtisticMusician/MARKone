import './styles/global.css';
import App from './app/App.js';

import { initTheme } from './services/theme.js';

import { initEditor } from './components/Editor/Editor.js';
import { initPreview } from './components/Preview/Preview.js';
import { initToolbar } from './components/Toolbar/Toolbar.js';
import { initCheatsheet } from './components/Cheatsheet/Cheatsheet.js';
import { initSettings } from './components/Settings/Settings.js';
import { initFindReplace } from './components/FindReplace/FindReplace.js';

const initApp = () => {
    initTheme();
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = App();

    // Init components after mount
    initToolbar();
    initEditor();
    initPreview();
    initCheatsheet();
    initSettings();
    initFindReplace();
};

document.addEventListener('DOMContentLoaded', initApp);
