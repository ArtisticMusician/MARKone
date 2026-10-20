const THEME_KEY = 'markone_theme';

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, newTheme);
    return newTheme;
}

export function initTheme() {
    const theme = getTheme();
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    return theme;
}
