class EditorState {
    constructor() {
        this.state = {
            fileName: 'Untitled.md',
            path: null,
            content: '',
            dirty: false
        };
        this.listeners = [];
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    setFileName(fileName) {
        this.setState({ fileName });
    }

    setPath(path) {
        this.setState({ path });
    }

    setContent(content) {
        this.setState({ content });
    }

    setDirty(dirty) {
        this.setState({ dirty });
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

export const editorState = new EditorState();
