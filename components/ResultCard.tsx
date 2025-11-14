import React, { useState } from 'react';
import { AdherenceData, AdherenceStatus } from '../types';
import { PillIcon } from './icons/PillIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { BellAlertIcon } from './icons/BellAlertIcon';

interface ResultCardProps {
  data: AdherenceData;
  onSetupNotification: () => void;
}

const getStatusTheme = (status: AdherenceStatus) => {
  switch (status) {
    case AdherenceStatus.Success:
      return {
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-500 dark:border-green-600',
        textColor: 'text-green-800 dark:text-green-300',
        icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
        title: "Adherence Status: Success"
      };
    case AdherenceStatus.VerificationNeeded:
      return {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-500 dark:border-yellow-600',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        icon: <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />,
        title: "Adherence Status: Verification Needed"
      };
    case AdherenceStatus.CriticalAlert:
      return {
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-500 dark:border-red-600',
        textColor: 'text-red-800 dark:text-red-300',
        icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
        title: "Adherence Status: Critical Alert"
      };
    default:
        return {
        bgColor: 'bg-slate-100 dark:bg-slate-700/30',
        borderColor: 'border-slate-500 dark:border-slate-600',
        textColor: 'text-slate-800 dark:text-slate-300',
        icon: <ExclamationTriangleIcon className="h-8 w-8 text-slate-500" />,
        title: "Adherence Status: Unknown"
      };
  }
};

const ResultCard: React.FC<ResultCardProps> = ({ data, onSetupNotification }) => {
  const theme = getStatusTheme(data.adherence_status);
  const [reminderSet, setReminderSet] = useState(false);

  const handleSetupClick = () => {
    onSetupNotification();
    setReminderSet(true);
  };

  const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number, valueClass?: string }> = ({ icon, label, value, valueClass }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`text-lg font-semibold text-slate-900 dark:text-white ${valueClass || ''}`}>{value}</p>
        </div>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 ${theme.borderColor} p-6`}>
      <div className="flex items-center mb-4">
        {theme.icon}
        <h2 className={`ml-3 text-2xl font-bold ${theme.textColor}`}>{theme.title}</h2>
      </div>
      
      <p className="mb-6 text-slate-600 dark:text-slate-300">{data.reasoning_summary}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <InfoItem icon={<UserIcon />} label="Patient" value={data.patient_name_extracted} />
        <InfoItem icon={<PillIcon />} label="Medication" value={data.medication_name_extracted} />
        <InfoItem icon={<CalendarIcon />} label="Refill Alert Date" value={data.refill_alert_date} valueClass="text-blue-600 dark:text-blue-400" />
      </div>

      <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Calculation Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong className="font-medium text-slate-600 dark:text-slate-300">Days Supply Calculated:</strong> {data.days_supply_calculated} days</p>
            <p><strong className="font-medium text-slate-600 dark:text-slate-300">Total Quantity Dispensed:</strong> {data.calculation_details?.total_quantity_dispensed ?? 'N/A'}</p>
            <p><strong className="font-medium text-slate-600 dark:text-slate-300">Daily Consumption:</strong> {data.calculation_details?.daily_consumption ?? 'N/A'} units/day</p>
            <p><strong className="font-medium text-slate-600 dark:text-slate-300">Medication Verified:</strong> 
                <span className={data.medication_verified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {data.medication_verified ? ' Yes' : ' No'}
                </span>
            </p>
        </div>
      </div>

      {data.adherence_status === AdherenceStatus.Success && (
        <div className="mt-6 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-200">Stay on Track!</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Set up a browser notification for your refill reminder.</p>
          </div>
          <button
            onClick={handleSetupClick}
            disabled={reminderSet}
            className="flex items-center text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:saturate-50"
          >
            <BellAlertIcon className="h-5 w-5 mr-2" />
            {reminderSet ? 'Reminder Set!' : 'Set Reminder'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultCard;