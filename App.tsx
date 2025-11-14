import React, { useState, useCallback } from 'react';
import { ExtractedMedication, AnalyzedMedication } from './types';
import { extractMedicationsFromPrescription, analyzeMedicationAdherence, verifyMedicationMatch } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AuthPage from './components/AuthPage';
import RefillDatesDashboard from './components/RefillDatesDashboard';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import StepIndicator from './components/StepIndicator';
import SuccessModal from './components/SuccessModal';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [extractedMedications, setExtractedMedications] = useState<ExtractedMedication[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- State for Step 2: Dynamic Upload Flow ---
  const [currentMedicationIndex, setCurrentMedicationIndex] = useState<number>(0);
  const [medicationPhotoFiles, setMedicationPhotoFiles] = useState<File[]>([]);
  
  // --- State for Step 3: Final Dashboard ---
  const [analyzedMedications, setAnalyzedMedications] = useState<AnalyzedMedication[] | null>(null);

  // --- State for UX Progress Indicator ---
  const [appStep, setAppStep] = useState<number>(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);


  // CRITICAL FIX: Ensure allPhotosUploaded is only true if medications exist and all photos are uploaded.
  const allPhotosUploaded = extractedMedications && extractedMedications.length > 0 && medicationPhotoFiles.length === extractedMedications.length;


  const handleExtractionRequest = useCallback(async () => {
    if (!prescriptionFile) {
      setError("Please upload a prescription document.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedMedications(null);

    try {
      const prescriptionData = await fileToGenerativePart(prescriptionFile);
      const medications = await extractMedicationsFromPrescription(prescriptionData);
      
      if (medications.length === 0) {
        setError("Error: No medications found in the document. Please upload a valid file.");
        setExtractedMedications(null); // CRITICAL: Set to null, not [], to signify a failed attempt and prevent progress.
      } else {
        setExtractedMedications(medications);
        setAppStep(2); // Move to step 2 on successful extraction
      }
    } catch (e) {
      console.error(e);
      setError("Failed to extract medication data. The AI model might be busy or the returned data was malformed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [prescriptionFile]);

  const handleMedicationPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !extractedMedications || allPhotosUploaded) return;

    setIsLoading(true);
    setError(null);
    
    try {
        const expectedMedication = extractedMedications[currentMedicationIndex];
        const photoPart = await fileToGenerativePart(file);
        
        const verificationResult = await verifyMedicationMatch(expectedMedication.medication_name, photoPart);

        if (verificationResult.match_status) {
            // Success: Medication matches
            setMedicationPhotoFiles(prevFiles => [...prevFiles, file]);
            setCurrentMedicationIndex(prevIndex => prevIndex + 1);
        } else {
            // Failure: Mismatch detected
            setError(`SECURITY ALERT! This product is ${verificationResult.identified_product_name}, which does not match the prescription for ${expectedMedication.medication_name}.`);
        }
    } catch (err) {
        console.error(err);
        setError("An error occurred during medication verification. Please try again.");
    } finally {
        setIsLoading(false);
        // Clear the file input value to allow re-uploading the same file if needed after an error
        e.target.value = '';
    }
  };

  const handleFinalAnalysis = async () => {
    if (!extractedMedications || !allPhotosUploaded) {
        setError("Cannot perform analysis, not all data is available.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const analysisPromises = extractedMedications.map(async (med, index) => {
            const photoFile = medicationPhotoFiles[index];
            const photoPart = await fileToGenerativePart(photoFile);
            
            const { daily_consumption } = await analyzeMedicationAdherence(med, photoPart);

            const days_supply = Math.floor(med.quantity_dispensed / daily_consumption);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + days_supply);

            return {
                ...med,
                daily_consumption,
                days_supply,
                end_date: endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            };
        });

        const results = await Promise.all(analysisPromises);
        setAnalyzedMedications(results);
        setAppStep(3); // Move to step 3 on successful analysis

    } catch(e) {
        console.error(e);
        setError("An error occurred during the final analysis phase. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancelPrescription = () => {
    setPrescriptionFile(null);
    setExtractedMedications(null);
    setMedicationPhotoFiles([]);
    setCurrentMedicationIndex(0);
    setAnalyzedMedications(null);
    setError(null);
    setAppStep(1); // Reset to step 1
  };

  const handleAlarmsConfigured = () => {
    setAppStep(4); // Move to final step
  };
  
  const handleFlowComplete = () => {
    setIsSuccessModalOpen(true);
  };

  const fileToGenerativePart = async (file: File): Promise<{mimeType: string, data: string}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("File could not be read as a data URL."));
            }
            const base64Data = reader.result.split(',')[1];
            resolve({
                mimeType: file.type,
                data: base64Data
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
  };

  const renderContent = () => {
    // Step 3 & 4: Display Final Dashboard
    if (analyzedMedications) {
        return <RefillDatesDashboard medications={analyzedMedications} onAlarmsConfigured={handleAlarmsConfigured} onFlowComplete={handleFlowComplete} />;
    }

    // Step 2 Completion: All photos are uploaded
    if (allPhotosUploaded) {
        return (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-green-500 dark:border-green-600 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">All Photos Uploaded!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">You have provided all the required medication photos. Ready for the final step.</p>
                <button
                    onClick={handleFinalAnalysis}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : "Proceed to Final Analysis"}
                </button>
            </div>
        );
    }

    // Step 2: Dynamic Photo Upload Flow
    if (extractedMedications && extractedMedications.length > 0) {
      const currentMedication = extractedMedications[currentMedicationIndex];
      return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Upload Medication Photos</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Medication {currentMedicationIndex + 1} of {extractedMedications.length}
          </p>
          <FileUpload
            id={`medication-photo-${currentMedicationIndex}`}
            label={`Upload Product Photo for: ${currentMedication.medication_name}`}
            file={medicationPhotoFiles[currentMedicationIndex] || null}
            onChange={handleMedicationPhotoUpload}
            acceptedFormats="image/*"
            disabled={isLoading}
            capture="environment"
          />
          {isLoading && <p className="text-center text-blue-600 dark:text-blue-400 mt-4">Verifying medication...</p>}
        </div>
      );
    }
    
    // Step 1: Initial Prescription Upload
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Upload Your Prescription</h2>
        {prescriptionFile ? (
          <div className="space-y-4">
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-600 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center justify-between animate-fade-in">
              <div className="flex items-center truncate">
                <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold block sm:inline">File uploaded: </span>
                  <span className="truncate">{prescriptionFile.name}</span>
                </div>
              </div>
              <button
                onClick={handleCancelPrescription}
                className="ml-4 flex-shrink-0 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Replace Prescription
              </button>
            </div>
            {!error && (
              <button
                onClick={handleExtractionRequest}
                disabled={isLoading}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting Medications...
                  </>
                ) : "Extract Medications from Prescription"}
              </button>
            )}
          </div>
        ) : (
          <FileUpload
            id="prescription"
            label="1. Upload Prescription Document"
            file={null}
            onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
            acceptedFormats="image/*,application/pdf"
            disabled={isLoading}
          />
        )}
      </div>
    );
  };


  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  
  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <header className="text-center mb-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
              AuraGuard AI
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              {analyzedMedications ? "Your Medication Refill Schedule" : "Your AI-powered Medication Adherence Agent"}
            </p>
          </header>

          <div className="mb-12 flex flex-col items-center pt-4">
            <StepIndicator currentStep={appStep} />
            <p className="mt-8 text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
              Step {appStep} of 4
            </p>
          </div>


          <main className="space-y-8">
            {renderContent()}
            
            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </main>
        </div>
      </div>
      {isSuccessModalOpen && <SuccessModal onReset={() => window.location.reload()} />}
    </>
  );
};

export default App;
