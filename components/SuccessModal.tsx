import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SuccessModalProps {
  onReset: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onReset }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 m-4 max-w-md w-full text-center transform transition-all animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-5">
          <CheckCircleIcon className="h-12 w-12 text-green-500 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Process Completed Successfully!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Alarms and notifications have been configured and shared.
        </p>
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-8 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
        >
          Finish / Restart
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;