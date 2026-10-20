import { insertFormat } from '../../utils/selection.js';

export function renderColorPickers() {
    return `
        <!-- Text Color -->
        <div class="relative">
            <button id="textColorBtn" class="px-3 py-1.5 rounded" title="Text Color">
                <i class="fas fa-font"></i>
                <span id="textColorIndicator" class="block h-1 w-full mt-0.5 rounded" style="background-color: #ef4444;"></span>
            </button>
            <div id="textColorDropdown" class="color-picker-dropdown absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-50 hidden p-2 w-max">
                <div class="grid grid-cols-6 gap-1" id="textColorsGrid">
                    <!-- Colors injected here -->
                </div>
                <div class="mt-2 border-t pt-2 border-color">
                    <label class="flex items-center gap-2 text-xs text-secondary">
                        <span>Custom:</span>
                        <input type="color" id="customTextColor" class="w-full h-6 p-0 border-0 rounded cursor-pointer bg-transparent">
                    </label>
                </div>
            </div>
        </div>

        <!-- Highlight Color -->
        <div class="relative">
            <button id="highlightColorBtn" class="px-3 py-1.5 rounded" title="Highlight Color">
                <i class="fas fa-highlighter"></i>
                <span id="highlightColorIndicator" class="block h-1 w-full mt-0.5 rounded" style="background-color: #fef08a;"></span>
            </button>
            <div id="highlightColorDropdown" class="color-picker-dropdown absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-50 hidden p-2 w-max">
                <div class="grid grid-cols-6 gap-1" id="highlightColorsGrid">
                    <!-- Colors injected here -->
                </div>
                <div class="mt-2 border-t pt-2 border-color">
                    <label class="flex items-center gap-2 text-xs text-secondary">
                        <span>Custom:</span>
                        <input type="color" id="customHighlightColor" class="w-full h-6 p-0 border-0 rounded cursor-pointer bg-transparent">
                    </label>
                </div>
            </div>
        </div>

        <!-- Background Color -->
        <div class="relative">
            <button id="bgColorBtn" class="px-3 py-1.5 rounded" title="Background Color">
                <i class="fas fa-fill-drip"></i>
                <span id="bgColorIndicator" class="block h-1 w-full mt-0.5 rounded border border-gray-300" style="background-color: #ffffff;"></span>
            </button>
            <div id="bgColorDropdown" class="color-picker-dropdown absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-50 hidden p-2 w-max">
                <div class="grid grid-cols-6 gap-1" id="bgColorsGrid">
                    <!-- Colors injected here -->
                </div>
                <div class="mt-2 border-t pt-2 border-color">
                    <label class="flex items-center gap-2 text-xs text-secondary">
                        <span>Custom:</span>
                        <input type="color" id="customBgColor" class="w-full h-6 p-0 border-0 rounded cursor-pointer bg-transparent">
                    </label>
                </div>
            </div>
        </div>
    `;
}

export function initColorPickers() {
    const editor = document.getElementById('editor');

    const textColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#000000', '#ffffff', '#06b6d4', '#84cc16'];
    const highlightColors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa', '#fbcfe8', '#a5f3fc', '#d1d5db', '#fcd34d', '#c4b5fd'];
    const bgColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#000000', '#0f172a', '#1e293b', '#334155', '#475569', '#fee2e2', '#dcfce7', '#dbeafe', '#fef3c7', '#f3e8ff'];

    const renderGrid = (gridId, colors, handler) => {
        const grid = document.getElementById(gridId);
        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'w-6 h-6 rounded border border-gray-300';
            btn.style.backgroundColor = color;
            btn.addEventListener('click', () => handler(color));
            grid.appendChild(btn);
        });
    };

    const applyTextColor = (color) => {
        document.getElementById('textColorIndicator').style.backgroundColor = color;
        insertFormat(editor, `<span style="color: ${color};">`, '</span>');
        document.getElementById('textColorDropdown').classList.add('hidden');
    };

    const applyHighlightColor = (color) => {
        document.getElementById('highlightColorIndicator').style.backgroundColor = color;
        insertFormat(editor, `<mark style="background-color: ${color};">`, '</mark>');
        document.getElementById('highlightColorDropdown').classList.add('hidden');
    };

    const applyBgColor = (color) => {
        document.getElementById('bgColorIndicator').style.backgroundColor = color;
        insertFormat(editor, `<div style="background-color: ${color}; padding: 10px; border-radius: 5px;">\n\n`, '\n\n</div>');
        document.getElementById('bgColorDropdown').classList.add('hidden');
    };

    renderGrid('textColorsGrid', textColors, applyTextColor);
    renderGrid('highlightColorsGrid', highlightColors, applyHighlightColor);
    renderGrid('bgColorsGrid', bgColors, applyBgColor);

    // Dropdown toggles
    const setupToggle = (btnId, dropdownId) => {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.color-picker-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.add('hidden');
            });
            dropdown.classList.toggle('hidden');
        });
    };

    setupToggle('textColorBtn', 'textColorDropdown');
    setupToggle('highlightColorBtn', 'highlightColorDropdown');
    setupToggle('bgColorBtn', 'bgColorDropdown');

    // Custom pickers
    document.getElementById('customTextColor').addEventListener('change', (e) => applyTextColor(e.target.value));
    document.getElementById('customHighlightColor').addEventListener('change', (e) => applyHighlightColor(e.target.value));
    document.getElementById('customBgColor').addEventListener('change', (e) => applyBgColor(e.target.value));

    // Hide dropdowns on click outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.color-picker-dropdown').forEach(d => d.classList.add('hidden'));
    });
}
