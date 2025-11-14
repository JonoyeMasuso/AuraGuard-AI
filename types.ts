export interface ExtractedMedication {
  medication_name: string;
  dosing_instructions: string;
  quantity_dispensed: number;
}

export interface AnalyzedMedication extends ExtractedMedication {
  daily_consumption: number;
  days_supply: number;
  end_date: string;
}

export interface VerificationResult {
  match_status: boolean;
  identified_product_name: string;
}

// FIX: Add AdherenceStatus enum to define adherence states, which was missing.
export enum AdherenceStatus {
  Success = 'SUCCESS',
  VerificationNeeded = 'VERIFICATION_NEEDED',
  CriticalAlert = 'CRITICAL_ALERT',
}

// FIX: Add AdherenceData interface for type safety in ResultCard component, which was missing.
export interface AdherenceData {
  adherence_status: AdherenceStatus;
  reasoning_summary: string;
  patient_name_extracted: string;
  medication_name_extracted: string;
  refill_alert_date: string;
  days_supply_calculated: number;
  calculation_details?: {
    total_quantity_dispensed?: number;
    daily_consumption?: number;
  };
  medication_verified: boolean;
}