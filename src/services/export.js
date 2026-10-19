export function exportToPDF(previewElement, fileName) {
    if (!window.html2pdf) {
        console.error('html2pdf is not loaded');
        return;
    }

    // Create a temporary container
    const printContainer = document.createElement('div');
    printContainer.style.padding = '20px';
    printContainer.style.color = '#000'; // Force black text
    printContainer.style.backgroundColor = '#fff'; // Force white background
    printContainer.innerHTML = previewElement.innerHTML;

    // Clean up specific things for PDF
    const tables = printContainer.querySelectorAll('table');
    tables.forEach(table => {
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginBottom = '1rem';
        const cells = table.querySelectorAll('th, td');
        cells.forEach(cell => {
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '8px';
        });
    });

    const opt = {
        margin:       1,
        filename:     fileName.replace('.md', '.pdf'),
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(printContainer).save();
}

export function exportToHTML(previewElement, fileName) {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${fileName.replace('.md', '')}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        img { max-width: 100%; height: auto; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    ${previewElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.md', '.html');
    a.click();
    URL.revokeObjectURL(url);
}

export function exportToTXT(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.md', '.txt');
    a.click();
    URL.revokeObjectURL(url);
}
