const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Regression Tests', () => {
    let fileUrl;

    test.beforeEach(async ({ page }) => {
        const filePath = path.resolve(__dirname, '../MARKOne.html');
        fileUrl = `file://${filePath}`;
        await page.goto(fileUrl);
    });

    test('Recent files shows path when provided', async ({ page }) => {
        // Since we can't fully mock Electron IPC easily in a pure web test,
        // we'll inject a recent file manually via localstorage or evaluating the function
        await page.evaluate(() => {
            addToRecent('test.md', '# Hello', '/absolute/path/to/test.md');
        });

        await page.locator('button[title="Menu"]').click();

        // Assert path is visible
        const recentItem = page.locator('.recent-item').first();
        await expect(recentItem).toContainText('test.md');
        await expect(recentItem).toContainText('/absolute/path/to/test.md');
    });

    test('Settings modal renders with credits', async ({ page }) => {
        await page.locator('button[title="Settings"]').click();

        const modal = page.locator('#settingsModal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h3').filter({ hasText: 'Credits & License' })).toBeVisible();
        await expect(modal.locator('div').filter({ hasText: 'Copyright © Josh McCann.' }).first()).toBeVisible();
    });

    test('Tables render with custom CSS', async ({ page }) => {
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = `
| H1 | H2 |
| -- | -- |
| V1 | V2 |`;
            editor.dispatchEvent(new Event('input'));
        });

        // Check if marked parsed it into a table
        const table = page.locator('#preview table');
        await expect(table).toBeVisible();
        await expect(table.locator('th').first()).toHaveText('H1');
        await expect(table.locator('td').first()).toHaveText('V1');
    });
});
