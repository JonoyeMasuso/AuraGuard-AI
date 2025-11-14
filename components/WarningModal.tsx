
import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface WarningModalProps {
  medicationName: string;
  onDismiss: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ medicationName, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 m-4 max-w-md w-full text-center transform transition-all animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-5">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {`MEDICATION ${medicationName?.toUpperCase() || 'UNKNOWN'} NOT LISTED ON PRESCRIPTION`}
        </h3>
        <button
          onClick={onDismiss}
          className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-8 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default WarningModal;