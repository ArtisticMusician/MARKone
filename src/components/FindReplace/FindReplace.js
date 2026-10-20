import { getSelectionRanges } from '../../utils/selection.js';

export function renderFindReplace() {
    return `
    <div id="findReplaceModal" class="fixed top-4 right-4 z-50 bg-primary border border-color rounded-lg shadow-2xl p-4 w-80 hidden" style="backdrop-filter: blur(5px);">
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-sm">Find and Replace</h3>
            <button id="closeFindReplaceBtn" class="text-secondary hover:text-primary">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="space-y-3">
            <div class="relative">
                <input type="text" id="findInput" placeholder="Find" class="w-full bg-secondary border border-color rounded px-3 py-1.5 text-sm outline-none focus:border-text-secondary pr-8">
                <div class="absolute right-2 top-1.5 flex gap-1">
                    <button id="matchCaseBtn" class="text-xs px-1 rounded hover:bg-hover-bg text-secondary" title="Match Case">Aa</button>
                    <button id="wholeWordBtn" class="text-xs px-1 rounded hover:bg-hover-bg text-secondary" title="Whole Word">W</button>
                    <button id="regexBtn" class="text-xs px-1 rounded hover:bg-hover-bg text-secondary" title="Use Regular Expression">.*</button>
                </div>
            </div>

            <input type="text" id="replaceInput" placeholder="Replace" class="w-full bg-secondary border border-color rounded px-3 py-1.5 text-sm outline-none focus:border-text-secondary">

            <div class="flex items-center justify-between text-xs text-secondary mt-1">
                <span id="findResults">No results</span>
                <div class="flex gap-1">
                    <button id="findPrevBtn" class="px-2 py-1 bg-secondary border border-color rounded hover:bg-hover-bg">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button id="findNextBtn" class="px-2 py-1 bg-secondary border border-color rounded hover:bg-hover-bg">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-color">
                <button id="replaceBtn" class="flex-1 py-1.5 bg-secondary border border-color rounded text-sm hover:bg-hover-bg">Replace</button>
                <button id="replaceAllBtn" class="flex-1 py-1.5 bg-secondary border border-color rounded text-sm hover:bg-hover-bg">Replace All</button>
            </div>
        </div>
    </div>
    `;
}

export function initFindReplace() {
    const modal = document.getElementById('findReplaceModal');
    const closeBtn = document.getElementById('closeFindReplaceBtn');
    const findInput = document.getElementById('findInput');
    const replaceInput = document.getElementById('replaceInput');
    const findNextBtn = document.getElementById('findNextBtn');
    const findPrevBtn = document.getElementById('findPrevBtn');
    const replaceBtn = document.getElementById('replaceBtn');
    const replaceAllBtn = document.getElementById('replaceAllBtn');
    const matchCaseBtn = document.getElementById('matchCaseBtn');
    const wholeWordBtn = document.getElementById('wholeWordBtn');
    const regexBtn = document.getElementById('regexBtn');
    const findResults = document.getElementById('findResults');
    const editor = document.getElementById('editor');

    let matches = [];
    let currentMatchIndex = -1;
    let matchCase = false;
    let wholeWord = false;
    let useRegex = false;

    window.showFindReplace = () => {
        modal.classList.remove('hidden');
        findInput.focus();

        // Auto-fill from selection
        const { text } = getSelectionRanges(editor);
        if (text && !text.includes('\n')) {
            findInput.value = text;
            performFind();
        }
    };

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        editor.focus();
    });

    const toggleOption = (btn, stateRef, updateFunc) => {
        btn.addEventListener('click', () => {
            const isActive = !btn.classList.contains('text-primary');
            if (isActive) {
                btn.classList.remove('text-secondary');
                btn.classList.add('text-primary', 'font-bold');
            } else {
                btn.classList.add('text-secondary');
                btn.classList.remove('text-primary', 'font-bold');
            }
            updateFunc(isActive);
            performFind();
        });
    };

    toggleOption(matchCaseBtn, matchCase, (v) => matchCase = v);
    toggleOption(wholeWordBtn, wholeWord, (v) => wholeWord = v);
    toggleOption(regexBtn, useRegex, (v) => useRegex = v);

    const performFind = () => {
        const text = editor.value;
        const query = findInput.value;
        matches = [];
        currentMatchIndex = -1;

        if (!query) {
            findResults.textContent = 'No results';
            return;
        }

        try {
            let regexStr = query;
            if (!useRegex) {
                regexStr = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            if (wholeWord) {
                regexStr = `\\b${regexStr}\\b`;
            }

            const flags = matchCase ? 'g' : 'gi';
            const regex = new RegExp(regexStr, flags);

            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0]
                });
                if (!regex.global) break;
            }
        } catch (e) {
            findResults.textContent = 'Invalid Regex';
            return;
        }

        if (matches.length > 0) {
            currentMatchIndex = 0;
            // Try to find match closest to cursor
            const cursorPos = editor.selectionStart;
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].start >= cursorPos) {
                    currentMatchIndex = i;
                    break;
                }
            }
            highlightCurrentMatch();
        } else {
            findResults.textContent = '0/0';
        }
    };

    const highlightCurrentMatch = () => {
        if (matches.length === 0 || currentMatchIndex === -1) return;

        findResults.textContent = `${currentMatchIndex + 1}/${matches.length}`;
        const match = matches[currentMatchIndex];

        editor.setSelectionRange(match.start, match.end);

        // Scroll into view
        const textBefore = editor.value.substring(0, match.start);
        const newLines = (textBefore.match(/\n/g) || []).length;
        const lineHeight = parseInt(window.getComputedStyle(editor).lineHeight);
        editor.scrollTop = (newLines * lineHeight) - (editor.clientHeight / 2);
    };

    findInput.addEventListener('input', performFind);

    findInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) findPrevBtn.click();
            else findNextBtn.click();
        }
    });

    findNextBtn.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        highlightCurrentMatch();
    });

    findPrevBtn.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        highlightCurrentMatch();
    });

    replaceBtn.addEventListener('click', () => {
        if (matches.length === 0 || currentMatchIndex === -1) return;

        const match = matches[currentMatchIndex];
        const replacement = replaceInput.value;

        editor.setRangeText(replacement, match.start, match.end, 'end');
        editor.dispatchEvent(new Event('input', { bubbles: true }));

        performFind();
    });

    replaceAllBtn.addEventListener('click', () => {
        if (matches.length === 0) return;

        // Reverse array to not mess up indices during replacement
        const reversedMatches = [...matches].reverse();
        const replacement = replaceInput.value;

        reversedMatches.forEach(match => {
            editor.setRangeText(replacement, match.start, match.end);
        });

        editor.dispatchEvent(new Event('input', { bubbles: true }));
        performFind();
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            window.showFindReplace();
        }
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            window.showFindReplace();
            replaceInput.focus();
        }
    });
}
