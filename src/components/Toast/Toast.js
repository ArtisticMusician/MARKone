import styles from './Toast.module.css';

let toastTimeout;

export function renderToast() {
    return `
        <div id="toast" class="${styles.toast} fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-2 pointer-events-none z-50">
            <span id="toastMessage"></span>
        </div>
    `;
}

export function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 3000);
}
