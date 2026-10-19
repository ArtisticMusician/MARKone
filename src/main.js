import '../styles/global.css';
import App from './app/App.js';

const initApp = () => {
    const appContainer = document.getElementById('app');
    // We will mount App components here as UI is refactored
    appContainer.innerHTML = App();
};

document.addEventListener('DOMContentLoaded', initApp);
