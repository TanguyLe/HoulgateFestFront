// Tiny pub/sub toast store, same pattern as login/store.js. Replaces window.alert().
let toasts = [];
let listeners = [];
let nextId = 0;

const emit = () => listeners.forEach((fct) => fct(toasts));

export const subscribe = (fct) => {
    listeners.push(fct);
    fct(toasts);

    return () => {
        listeners = listeners.filter((listener) => listener !== fct);
    };
};

export const dismiss = (id) => {
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
};

const push =
    (tone) =>
    (message, duration = 7000) => {
        const toast = { id: ++nextId, tone, message: String(message) };

        toasts = [...toasts, toast];
        emit();

        if (duration) setTimeout(() => dismiss(toast.id), duration);

        return toast.id;
    };

export const notify = {
    info: push("info"),
    success: push("success"),
    error: push("error"),
};
