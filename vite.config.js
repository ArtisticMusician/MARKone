import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: './',
    build: {
        outDir: 'dist-web',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
    }
});
