import React from 'react';

interface StepIndicatorProps {
  currentStep: number; // Expects 1, 2, 3, or 4
}

const steps = [
  "Upload Prescription",
  "Upload Medications",
  "Set Refill Alarms",
  "Final Summary",
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {isCompleted ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-blue-600" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                </>
              ) : isActive ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:bg-slate-800" aria-current="step">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                  </div>
                  <span className="absolute -bottom-6 text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{step}</span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800">
                     <span className="h-2.5 w-2.5 rounded-full bg-transparent " aria-hidden="true" />
                  </div>
                   <span className="absolute -bottom-6 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:block">{step}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;