import styles from './Preview.module.css';
import { editorState } from '../../state/editorState.js';
import { parseMarkdown } from '../../services/markdown.js';

export function renderPreview() {
    return `
        <!-- Render Mode Switcher -->
        <div class="h-10 border-b border-color flex items-center px-4 bg-secondary">
            <div class="flex space-x-4">
                <button id="btnPreview" class="text-sm font-semibold text-primary pb-1 border-b-2 border-primary">Preview</button>
                <button id="btnSource" class="text-sm font-medium text-secondary hover:text-primary pb-1 border-b-2 border-transparent">HTML Source</button>
            </div>
        </div>

        <!-- Preview Content -->
        <div class="flex-1 overflow-auto relative">
            <div id="preview" class="preview-pane absolute inset-0 p-8 prose max-w-none"></div>
            <pre id="sourceView" class="absolute inset-0 p-8 hidden overflow-auto text-sm font-mono whitespace-pre-wrap"></pre>
        </div>

        <!-- Stats Bar -->
        <div class="h-8 border-t border-color flex items-center px-4 text-xs text-secondary bg-secondary justify-between select-none">
            <div class="flex space-x-4">
                <span>Words: <span id="wordCount">0</span></span>
                <span>Characters: <span id="charCount">0</span></span>
            </div>
            <div class="flex space-x-4">
                <span>Paragraphs: <span id="paragraphCount">0</span></span>
                <span>Sentences: <span id="sentenceCount">0</span></span>
            </div>
        </div>
    `;
}

export function initPreview() {
    const preview = document.getElementById('preview');
    const sourceView = document.getElementById('sourceView');
    const btnPreview = document.getElementById('btnPreview');
    const btnSource = document.getElementById('btnSource');

    // Tab switching
    btnPreview.addEventListener('click', () => {
        preview.classList.remove('hidden');
        sourceView.classList.add('hidden');
        btnPreview.classList.replace('text-secondary', 'text-primary');
        btnPreview.classList.replace('border-transparent', 'border-primary');
        btnPreview.classList.add('font-semibold');
        btnPreview.classList.remove('font-medium');
        btnSource.classList.replace('text-primary', 'text-secondary');
        btnSource.classList.replace('border-primary', 'border-transparent');
        btnSource.classList.remove('font-semibold');
        btnSource.classList.add('font-medium');
    });

    btnSource.addEventListener('click', () => {
        sourceView.classList.remove('hidden');
        preview.classList.add('hidden');
        btnSource.classList.replace('text-secondary', 'text-primary');
        btnSource.classList.replace('border-transparent', 'border-primary');
        btnSource.classList.add('font-semibold');
        btnSource.classList.remove('font-medium');
        btnPreview.classList.replace('text-primary', 'text-secondary');
        btnPreview.classList.replace('border-primary', 'border-transparent');
        btnPreview.classList.remove('font-semibold');
        btnPreview.classList.add('font-medium');
    });

    // Update markdown output and stats on content change
    editorState.subscribe((state) => {
        const html = parseMarkdown(state.content);
        preview.innerHTML = html;
        sourceView.textContent = html;
        updateStats(state.content);
    });
}

function updateStats(text) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    document.getElementById('paragraphCount').textContent = paragraphs;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    document.getElementById('sentenceCount').textContent = sentences;

    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    document.getElementById('wordCount').textContent = words.length;

    document.getElementById('charCount').textContent = text.length;
}
