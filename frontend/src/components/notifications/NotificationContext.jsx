import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

const typeConfig = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    iconClassName: 'text-rose-600',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    iconClassName: 'text-amber-600',
  },
  info: {
    icon: Info,
    className: 'border-sky-200 bg-sky-50 text-sky-900',
    iconClassName: 'text-sky-600',
  },
};

let notificationSeed = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));

    const timerId = timersRef.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  };

  const pushNotification = ({ title, message, type = 'info', duration = 3500 }) => {
    const id = ++notificationSeed;
    const notification = {
      id,
      title,
      message,
      type,
    };

    setNotifications((current) => [notification, ...current].slice(0, 4));

    const timerId = window.setTimeout(() => {
      removeNotification(id);
    }, duration);

    timersRef.current.set(id, timerId);
    return id;
  };

  const api = useMemo(() => ({
    success: (message, options = {}) => pushNotification({ type: 'success', message, ...options }),
    error: (message, options = {}) => pushNotification({ type: 'error', message, ...options }),
    warning: (message, options = {}) => pushNotification({ type: 'warning', message, ...options }),
    info: (message, options = {}) => pushNotification({ type: 'info', message, ...options }),
    dismiss: removeNotification,
  }), []);

  return (
    <NotificationContext.Provider value={api}>
      {children}

      <div
        className="pointer-events-none fixed right-4 top-4 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6 sm:w-full"
        style={{ zIndex: 70 }}
      >
        {notifications.map((notification) => {
          const config = typeConfig[notification.type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg shadow-black/5 backdrop-blur-sm ${config.className}`}
              role="status"
              aria-live="polite"
            >
              <div className={`mt-0.5 shrink-0 ${config.iconClassName}`}>
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                {notification.title && (
                  <p className="text-sm font-semibold leading-5">
                    {notification.title}
                  </p>
                )}
                <p className="text-sm leading-5 text-current/85">
                  {notification.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeNotification(notification.id)}
                className="shrink-0 rounded-full p-1 text-current/50 transition-colors hover:bg-black/5 hover:text-current"
                aria-label="Fechar notificação"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}
