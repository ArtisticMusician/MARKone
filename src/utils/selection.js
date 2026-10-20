export function getSelectionRanges(editorElement) {
    return {
        start: editorElement.selectionStart,
        end: editorElement.selectionEnd,
        text: editorElement.value.substring(editorElement.selectionStart, editorElement.selectionEnd)
    };
}

export function insertFormat(editorElement, prefix, suffix = '') {
    const { start, end, text } = getSelectionRanges(editorElement);
    const replacement = prefix + text + suffix;
    editorElement.setRangeText(replacement, start, end, 'select');
    editorElement.dispatchEvent(new Event('input', { bubbles: true }));
    editorElement.focus();
}

export function insertList(editorElement, type) {
    const { start, end, text } = getSelectionRanges(editorElement);
    const lines = text.split('\n');
    let replacement = '';

    if (type === 'ordered') {
        replacement = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
    } else if (type === 'unordered') {
        replacement = lines.map(line => `- ${line}`).join('\n');
    } else if (type === 'checklist') {
        replacement = lines.map(line => `- [ ] ${line}`).join('\n');
    }

    if (!text) {
        if (type === 'ordered') replacement = '1. ';
        else if (type === 'unordered') replacement = '- ';
        else if (type === 'checklist') replacement = '- [ ] ';
    }

    editorElement.setRangeText(replacement, start, end, 'end');
    editorElement.dispatchEvent(new Event('input', { bubbles: true }));
    editorElement.focus();
}

export function insertHeading(editorElement, level) {
    const prefix = '#'.repeat(level) + ' ';
    insertFormat(editorElement, prefix);
}
