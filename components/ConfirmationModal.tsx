import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  closeText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm,
    title,
    message,
    confirmText,
    closeText 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 m-4 max-w-md w-full text-center transform transition-all animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-5">
            <CheckCircleIcon className="h-12 w-12 text-green-500 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
        <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
            >
            <ShareIcon className="w-5 h-5 mr-2" />
            {confirmText}
            </button>
            <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm px-6 py-2.5 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
            >
            {closeText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;