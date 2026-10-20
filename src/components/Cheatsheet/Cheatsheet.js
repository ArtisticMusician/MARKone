export function renderCheatsheet() {
    return `
    <div id="cheatsheetModal" class="modal-bg fixed inset-0 z-50 flex items-center justify-center hidden" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);">
        <div class="modal-content border rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col bg-primary">
            <div class="flex items-center justify-between px-6 py-4 border-b border-color">
                <h2 class="text-xl font-bold">Markdown Cheatsheet</h2>
                <button id="closeCheatsheetBtn" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6 overflow-auto flex-1 grid gap-3">
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm"># Heading 1</code>
                        <span class="text-sm text-secondary">Heading 1</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">## Heading 2</code>
                        <span class="text-sm text-secondary">Heading 2</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">**bold**</code>
                        <span class="text-sm font-bold">bold</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">*italic*</code>
                        <span class="text-sm italic">italic</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">~~strikethrough~~</code>
                        <span class="text-sm line-through">strikethrough</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">\`inline code\`</code>
                        <code class="text-sm px-1 rounded bg-tertiary">inline code</code>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">\`\`\`code block\`\`\`</code>
                        <span class="text-sm text-secondary">Code block</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">[Link](url)</code>
                        <span class="text-sm text-blue-500 underline">Link</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">![Alt](url)</code>
                        <span class="text-sm text-secondary">Image</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <code class="text-sm">> blockquote</code>
                        <span class="text-sm border-l-2 pl-2 text-secondary border-color">blockquote</span>
                    </div>
                </div>
                <div class="cheatsheet-item p-3 rounded border border-color bg-secondary">
                    <div class="flex justify-between items-center">
                        <div class="text-sm"><code>- item 1</code><br><code>- item 2</code></div>
                        <ul class="text-sm list-disc pl-4"><li>item 1</li><li>item 2</li></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

export function initCheatsheet() {
    const modal = document.getElementById('cheatsheetModal');
    const closeBtn = document.getElementById('closeCheatsheetBtn');

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Make global for toolbar access if needed, or bind in Toolbar.js
    window.showCheatsheet = () => modal.classList.remove('hidden');
}
