import styles from './Editor.module.css';
import { editorState } from '../../state/editorState.js';

export function renderEditor() {
    return `
        <textarea id="editor" class="${styles.editor} flex-1 w-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed" placeholder="Type your markdown here..."></textarea>
    `;
}

export function initEditor() {
    const editor = document.getElementById('editor');

    // Listen for input to update global state
    editor.addEventListener('input', (e) => {
        editorState.setContent(e.target.value);
        editorState.setDirty(true);
    });

    // Sync state changes back to editor (e.g., file loaded)
    editorState.subscribe((state) => {
        if (editor.value !== state.content) {
            editor.value = state.content;
        }
    });
}
