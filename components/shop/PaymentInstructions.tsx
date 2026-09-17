'use client';
import { Copy } from 'lucide-react';
import { PAYMENT } from '@/lib/constants';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

export function PaymentInstructions({
  method,
  total,
}: {
  method: 'bkash' | 'nagad' | 'bank' | 'manual';
  total: number;
}) {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  if (method === 'bkash') {
    return (
      <div className="rounded-lg border bg-rose-50/60 p-4 text-sm">
        <p className="font-semibold text-rose-700 mb-2">📱 bKash Payment Instructions</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
          <li>Open bKash App or dial *247#</li>
          <li>
            Send <strong>{formatBDT(total)}</strong> to{' '}
            <button
              type="button"
              onClick={() => copy(PAYMENT.bkash)}
              className="inline-flex items-center gap-1 text-rose-600 font-semibold"
            >
              {PAYMENT.bkash} <Copy size={12} />
            </button>{' '}
            (Personal)
          </li>
          <li>Copy the Transaction ID (TrxID) from confirmation SMS</li>
          <li>Paste the TrxID below and place your order</li>
        </ol>
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ Admin will verify your payment within 2 hours. Order ships after confirmation.
        </p>
      </div>
    );
  }

  if (method === 'nagad') {
    return (
      <div className="rounded-lg border bg-orange-50/60 p-4 text-sm">
        <p className="font-semibold text-orange-700 mb-2">📱 Nagad Payment Instructions</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
          <li>Open Nagad App or dial *167#</li>
          <li>
            Send <strong>{formatBDT(total)}</strong> to{' '}
            <button
              type="button"
              onClick={() => copy(PAYMENT.nagad)}
              className="inline-flex items-center gap-1 text-orange-600 font-semibold"
            >
              {PAYMENT.nagad} <Copy size={12} />
            </button>
          </li>
          <li>Copy the Transaction ID from SMS</li>
          <li>Paste the TrxID below and place your order</li>
        </ol>
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ Admin will verify within 2 hours.
        </p>
      </div>
    );
  }

  if (method === 'bank') {
    return (
      <div className="rounded-lg border bg-blue-50/60 p-4 text-sm">
        <p className="font-semibold text-blue-700 mb-2">🏦 Bank Transfer Details</p>
        <div className="space-y-1 text-gray-700">
          <p>Bank: <strong>{PAYMENT.bankName}</strong></p>
          <p>
            Account:{' '}
            <button
              type="button"
              onClick={() => copy(PAYMENT.bankAccount)}
              className="inline-flex items-center gap-1 text-blue-600 font-semibold"
            >
              {PAYMENT.bankAccount} <Copy size={12} />
            </button>
          </p>
          <p>Branch: {PAYMENT.bankBranch}</p>
          <p>Amount: <strong>{formatBDT(total)}</strong></p>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ Submit the transaction reference below. Verification takes up to 24 hours.
        </p>
      </div>
    );
  }

  return null;
}