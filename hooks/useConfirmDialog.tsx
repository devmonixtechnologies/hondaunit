import { useCallback, useMemo, useRef, useState } from 'react';

import { ConfirmDialog } from '../components/common/ConfirmDialog';

type ConfirmTone = 'default' | 'danger';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
}

export const useConfirmDialog = () => {
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (dialogOptions: ConfirmDialogOptions) =>
      new Promise<boolean>(resolve => {
        setOptions(dialogOptions);
        resolverRef.current = resolve;
      }),
    []
  );

  const handleClose = useCallback(
    (result: boolean) => {
      resolverRef.current?.(result);
      resolverRef.current = null;
      setOptions(null);
    },
    []
  );

  const dialog = useMemo(
    () => (
      <ConfirmDialog
        open={Boolean(options)}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        tone={options?.tone}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    ),
    [handleClose, options]
  );

  return { confirm, ConfirmDialogComponent: dialog };
};

export default useConfirmDialog;
