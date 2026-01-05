import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const toneClasses = {
  danger: {
    icon: 'bg-red-500/15 text-red-300 border-red-500/20',
    confirm: 'bg-red-600 hover:bg-red-500 focus:ring-red-400'
  },
  default: {
    icon: 'bg-white/10 text-white border-white/10',
    confirm: 'bg-honda-red hover:bg-red-700 focus:ring-red-400'
  }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  isProcessing = false,
  onConfirm,
  onCancel
}) => {
  if (!open) {
    return null;
  }

  const styles = toneClasses[tone];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${styles.icon}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-gray-200 bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 ${styles.confirm}`}
            >
              {isProcessing ? 'Processing…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
