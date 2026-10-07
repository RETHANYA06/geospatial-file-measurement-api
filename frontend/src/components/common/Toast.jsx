import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useGeo();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 backdrop-blur-md ${
              isError
                ? 'bg-rose-950/90 border-rose-700/50 text-rose-200'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-700/50 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700/50 text-slate-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {!isError && !isSuccess && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
