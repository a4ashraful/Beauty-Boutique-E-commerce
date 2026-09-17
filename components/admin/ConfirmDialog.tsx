'use client';
import { ReactNode, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ConfirmDialog({
  trigger,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = true,
  onConfirm,
}: {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                destructive ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              <AlertTriangle size={18} />
            </span>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            {cancelText}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handle}
            disabled={busy}
          >
            {busy ? '…' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}