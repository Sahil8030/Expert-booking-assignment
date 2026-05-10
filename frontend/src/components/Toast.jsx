import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast message={toast.message} onDismiss={dismiss} toastId={toast.id} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

function Toast({ message, onDismiss, toastId }) {
  return (
    <div
      role="status"
      className="fixed right-6 top-6 z-[100] max-w-sm rounded-[10px] border border-border bg-bg-card px-4 py-3 text-sm font-medium text-text-primary shadow-lg"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-text-secondary hover:text-text-primary"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <ToastTimer toastId={toastId} onDismiss={onDismiss} />
    </div>
  );
}

function ToastTimer({ onDismiss, toastId }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 4000);
    return () => clearTimeout(id);
  }, [onDismiss, toastId]);

  return null;
}
