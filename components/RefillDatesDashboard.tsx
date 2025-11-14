import React, { useState } from 'react';
import { AnalyzedMedication } from '../types';
import { PillIcon } from './icons/PillIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { useNotifications } from '../hooks/useNotifications';
import { BellAlertIcon } from './icons/BellAlertIcon';
import ConfirmationModal from './ConfirmationModal'; // Import the new modal

interface RefillDatesDashboardProps {
  medications: AnalyzedMedication[];
  onAlarmsConfigured: () => void;
  onFlowComplete: () => void;
}

const RefillDatesDashboard: React.FC<RefillDatesDashboardProps> = ({ medications, onAlarmsConfigured, onFlowComplete }) => {
  const [dayThreshold, setDayThreshold] = useState<number>(3);
  const [alarmsActivated, setAlarmsActivated] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const { requestNotificationPermission, simulatePushNotification, permission } = useNotifications();

  const handleActivateAlarms = async () => {
    try {
        let currentPermission = permission;
        if (currentPermission !== 'granted') {
          currentPermission = await requestNotificationPermission();
        }

        if (currentPermission === 'granted') {
          medications.forEach(med => {
            const title = "Refill Alert!";
            const body = `Your ${med.medication_name} will run out in ${dayThreshold} days.`;
            simulatePushNotification(title, body);
          });
        } else {
            console.warn("Notification permissions were not granted, but proceeding to sharing modal as requested.");
        }
    } catch (error) {
        console.error("An error occurred trying to set notifications:", error);
    } finally {
        // Force these actions to happen regardless of notification success or failure
        setAlarmsActivated(true);
        setIsConfirmationModalOpen(true); // Open confirmation modal
        onAlarmsConfigured(); // Notify parent component
    }
  };

  const handleShareToContact = async () => {
    const shareText = `Alarm Scheduled! The patient has alarms set with a ${dayThreshold}-day notice. Medications:\n${medications
      .map(med => `- ${med.medication_name} (Ends on ${med.end_date})`)
      .join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Medication Refill Plan',
          text: shareText,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support Web Share API
      alert('The Share API is not supported by this browser.');
    }
    setIsConfirmationModalOpen(false); // Close modal after sharing attempt
    onFlowComplete(); // Trigger final success modal
  };
  
  const handleCloseConfirmationModal = () => {
      setIsConfirmationModalOpen(false);
      onFlowComplete(); // Trigger final success modal even on close
  }


  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Medication
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Daily Dosage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Days of Supply
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {medications.map((med, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-full">
                        <PillIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{med.medication_name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{med.dosing_instructions}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">{med.daily_consumption} units/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      {med.days_supply} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                      <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          {med.end_date}
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Intelligent Alarm Scheduling UI --- */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Intelligent Alarm Scheduling</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <div className="flex-grow w-full sm:w-auto">
              <label htmlFor="day-threshold" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Notice threshold:
              </label>
              <select
                id="day-threshold"
                value={dayThreshold}
                onChange={(e) => setDayThreshold(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-slate-800"
                disabled={alarmsActivated}
              >
                <option value={2}>Notify 2 days before</option>
                <option value={3}>Notify 3 days before</option>
                <option value={4}>Notify 4 days before</option>
                <option value={5}>Notify 5 days before</option>
              </select>
            </div>
            <button
              onClick={handleActivateAlarms}
              disabled={alarmsActivated}
              className="w-full sm:w-auto flex items-center justify-center text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:saturate-50"
            >
              <BellAlertIcon className="h-5 w-5 mr-2" />
              {alarmsActivated ? 'Alarms Activated' : 'Activate Refill Alarms'}
            </button>
          </div>
          {alarmsActivated && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-3 text-center sm:text-left">
                  Great! Proceed to notify a contact if you wish.
              </p>
          )}
        </div>

      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleShareToContact}
        title="Alarms Scheduled Successfully"
        message="Would you like to notify a contact or share the alarm configuration?"
        confirmText="Notify Contact"
        closeText="Close"
      />
    </>
  );
};

export default RefillDatesDashboard;