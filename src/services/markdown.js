// Relying on global marked as imported in index.html for now

export function parseMarkdown(markdown) {
    // Relying on global marked as imported in index.html for now
    if (window.marked) {
        return window.marked.parse(markdown);
    }
    return '';
}
