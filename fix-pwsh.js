const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', 'app-builder-lib', 'out', 'node-module-collector', 'nodeModulesCollector.js');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('"powershell.exe"')) {
        content = content.replace(/"powershell\.exe"/g, '"pwsh.exe"');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully patched electron-builder to use pwsh.exe');
    } else {
        console.log('electron-builder already patched or powershell.exe not found');
    }
} else {
    console.warn('Could not find nodeModulesCollector.js to patch.');
}
