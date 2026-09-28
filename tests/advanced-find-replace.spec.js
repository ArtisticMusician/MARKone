const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Advanced Find and Replace', () => {
    let fileUrl;

    test.beforeEach(async ({ page }) => {
        const filePath = path.resolve(__dirname, '../MARKOne.html');
        fileUrl = `file://${filePath}`;
        await page.goto(fileUrl);
    });

    test('should open floating modal on Ctrl+F', async ({ page }) => {
        const modal = page.locator('#findReplaceModal');
        await expect(modal).toBeHidden();

        await page.keyboard.press('Control+f');
        await expect(modal).toBeVisible();
        await expect(page.locator('#findInput')).toBeFocused();
    });

    test('should update match count dynamically and jump to matches', async ({ page }) => {
        // Set editor content
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = "Apple apple APPLE Banana apple.";
            editor.dispatchEvent(new Event('input'));
        });

        await page.locator('button[title="Find & Replace (Ctrl+F)"]').click();
        await page.locator('#findInput').fill('apple');

        // It's case insensitive by default: Apple, apple, APPLE, apple -> 4
        await expect(page.locator('#findMatchCount')).toHaveText('1 of 4');

        // Find next
        await page.locator('button[title="Next Match (Enter)"]').click();
        await expect(page.locator('#findMatchCount')).toHaveText('2 of 4');
    });

    test('should respect Match Case', async ({ page }) => {
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = "Apple apple APPLE Banana apple.";
            editor.dispatchEvent(new Event('input'));
        });

        await page.locator('button[title="Find & Replace (Ctrl+F)"]').click();
        await page.locator('#findInput').fill('apple');

        await page.locator('label[title="Match Case"]').click(); // toggle case sensitive

        // Should only match 'apple' and 'apple' (2)
        await expect(page.locator('#findMatchCount')).toHaveText('1 of 2');
    });

    test('should respect Whole Word', async ({ page }) => {
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = "app applet app apple.";
            editor.dispatchEvent(new Event('input'));
        });

        await page.locator('button[title="Find & Replace (Ctrl+F)"]').click();
        await page.locator('#findInput').fill('app');

        await page.locator('label[title="Match Whole Word"]').click(); // toggle whole word

        // Should match the two standalone 'app's, ignoring 'applet' and 'apple'
        await expect(page.locator('#findMatchCount')).toHaveText('1 of 2');
    });

    test('should replace one and jump', async ({ page }) => {
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = "foo bar foo baz";
            editor.dispatchEvent(new Event('input'));
        });

        await page.locator('button[title="Find & Replace (Ctrl+F)"]').click();
        await page.locator('#findInput').fill('foo');
        await page.locator('#replaceInput').fill('qux');

        // Wait for matches to update
        await page.waitForTimeout(50);

        // The cursor might not be perfectly on the match unless we jump to it once.
        // Our new logic replaces if selected, or jumps first. Let's click twice (Jump, then Replace).
        await page.locator('button:has-text("Replace")').first().click(); // Jumps to foo
        await page.locator('button:has-text("Replace")').first().click(); // Replaces it

        const text = await page.evaluate("document.getElementById('editor').value");
        // Depending on cursor location it might jump to the second one first.
        // But the total should have one qux and one foo.
        expect(text.match(/qux/g).length).toBe(1);
        expect(text.match(/foo/g).length).toBe(1);

        // Should jump to next
        await expect(page.locator('#findMatchCount')).toHaveText('1 of 1'); // Only 1 left
    });

    test('should replace all', async ({ page }) => {
        await page.evaluate(() => {
            const editor = document.getElementById('editor');
            editor.value = "foo bar foo baz";
            editor.dispatchEvent(new Event('input'));
        });

        await page.locator('button[title="Find & Replace (Ctrl+F)"]').click();
        await page.locator('#findInput').fill('foo');
        await page.locator('#replaceInput').fill('qux');

        await page.locator('button:has-text("Replace All")').click();

        const text = await page.evaluate("document.getElementById('editor').value");
        expect(text).toBe("qux bar qux baz");
    });
});
