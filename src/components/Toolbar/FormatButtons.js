import { insertFormat, insertList, insertHeading } from '../../utils/selection.js';

export function renderFormatButtons() {
    return `
        <div class="relative">
            <button id="headingBtn" class="px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-medium" title="Headings">
                <i class="fas fa-heading"></i>
                <i class="fas fa-chevron-down text-xs ml-1"></i>
            </button>
            <div id="headingDropdown" class="dropdown-menu absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-50 hidden min-w-[150px]">
                <button class="dropdown-item w-full text-left px-3 py-2 text-2xl font-bold" data-level="1">Heading 1</button>
                <button class="dropdown-item w-full text-left px-3 py-2 text-xl font-bold" data-level="2">Heading 2</button>
                <button class="dropdown-item w-full text-left px-3 py-2 text-lg font-bold" data-level="3">Heading 3</button>
                <button class="dropdown-item w-full text-left px-3 py-2 text-base font-bold" data-level="4">Heading 4</button>
                <button class="dropdown-item w-full text-left px-3 py-2 text-sm font-bold" data-level="5">Heading 5</button>
                <button class="dropdown-item w-full text-left px-3 py-2 text-xs font-bold" data-level="6">Heading 6</button>
            </div>
        </div>

        <div class="separator w-px h-6 mx-1 border-color"></div>

        <button id="btnBold" class="px-3 py-1.5 rounded" title="Bold (Ctrl+B)">
            <i class="fas fa-bold"></i>
        </button>
        <button id="btnItalic" class="px-3 py-1.5 rounded" title="Italic (Ctrl+I)">
            <i class="fas fa-italic"></i>
        </button>
        <button id="btnStrike" class="px-3 py-1.5 rounded" title="Strikethrough">
            <i class="fas fa-strikethrough"></i>
        </button>

        <div class="separator w-px h-6 mx-1 border-color"></div>

        <button id="btnListOl" class="px-3 py-1.5 rounded" title="Ordered List">
            <i class="fas fa-list-ol"></i>
        </button>
        <button id="btnListUl" class="px-3 py-1.5 rounded" title="Unordered List">
            <i class="fas fa-list-ul"></i>
        </button>
        <button id="btnListCheck" class="px-3 py-1.5 rounded" title="Checklist">
            <i class="fas fa-tasks"></i>
        </button>

        <div class="separator w-px h-6 mx-1 border-color"></div>

        <button id="btnQuote" class="px-3 py-1.5 rounded" title="Blockquote">
            <i class="fas fa-quote-right"></i>
        </button>
        <button id="btnCode" class="px-3 py-1.5 rounded" title="Inline Code">
            <i class="fas fa-code"></i>
        </button>
        <button id="btnCodeBlock" class="px-3 py-1.5 rounded" title="Code Block">
            <i class="fas fa-file-code"></i>
        </button>

        <div class="separator w-px h-6 mx-1 border-color"></div>

        <button id="btnLink" class="px-3 py-1.5 rounded" title="Link (Ctrl+K)">
            <i class="fas fa-link"></i>
        </button>
        <button id="btnImage" class="px-3 py-1.5 rounded" title="Image">
            <i class="fas fa-image"></i>
        </button>
        <button id="btnTable" class="px-3 py-1.5 rounded" title="Table">
            <i class="fas fa-table"></i>
        </button>
        <button id="btnHr" class="px-3 py-1.5 rounded" title="Horizontal Rule">
            <i class="fas fa-minus"></i>
        </button>
    `;
}

export function initFormatButtons() {
    const editor = document.getElementById('editor');

    // Headings
    const headingBtn = document.getElementById('headingBtn');
    const headingDropdown = document.getElementById('headingDropdown');

    headingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        headingDropdown.classList.toggle('hidden');
    });

    headingDropdown.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = parseInt(e.target.dataset.level, 10);
            insertHeading(editor, level);
            headingDropdown.classList.add('hidden');
        });
    });

    // Formatting
    document.getElementById('btnBold').addEventListener('click', () => insertFormat(editor, '**', '**'));
    document.getElementById('btnItalic').addEventListener('click', () => insertFormat(editor, '*', '*'));
    document.getElementById('btnStrike').addEventListener('click', () => insertFormat(editor, '~~', '~~'));

    // Lists
    document.getElementById('btnListOl').addEventListener('click', () => insertList(editor, 'ordered'));
    document.getElementById('btnListUl').addEventListener('click', () => insertList(editor, 'unordered'));
    document.getElementById('btnListCheck').addEventListener('click', () => insertList(editor, 'checklist'));

    // Quotes & Code
    document.getElementById('btnQuote').addEventListener('click', () => insertFormat(editor, '> '));
    document.getElementById('btnCode').addEventListener('click', () => insertFormat(editor, '`', '`'));
    document.getElementById('btnCodeBlock').addEventListener('click', () => insertFormat(editor, '```\n', '\n```'));

    // Insertions
    document.getElementById('btnLink').addEventListener('click', () => insertFormat(editor, '[', '](url)'));
    document.getElementById('btnImage').addEventListener('click', () => insertFormat(editor, '![alt text](', ')'));
    document.getElementById('btnTable').addEventListener('click', () => insertFormat(editor, '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n'));
    document.getElementById('btnHr').addEventListener('click', () => insertFormat(editor, '\n---\n'));

    // Hide dropdowns on click outside
    document.addEventListener('click', () => {
        headingDropdown.classList.add('hidden');
    });
}
