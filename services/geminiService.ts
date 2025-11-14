import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedMedication, VerificationResult } from "../types";

// FIX: Switched from Vite's `import.meta.env.VITE_API_KEY` to `process.env.API_KEY`
// to align with Gemini API guidelines and resolve the TypeScript error.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Updated error message to reflect the change to API_KEY.
  throw new Error("API_KEY is not configured. Check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getExtractionPrompt = () => {
    return `
**SYSTEM INSTRUCTION: Medical Data Extractor**

You are a specialized AI assistant for medical document processing. Your task is to analyze the provided prescription document (which could be an image or a PDF) and extract a comprehensive list of all medications mentioned within it.

**GOAL:** For each distinct medication found in the document, you must extract three specific pieces of information:
1.  **medication_name:** The full name of the medication.
2.  **dosing_instructions:** The complete and exact dosing instructions provided (e.g., "1 tablet by mouth twice daily", "Take 1 capsule every 8 hours with food").
3.  **quantity_dispensed:** The total numerical quantity of the medication that was dispensed (e.g., 30, 90, 100).

**OUTPUT SCHEMA:**
You MUST respond ONLY with a single, valid JSON array. Each element in the array must be an object representing one medication. Each object must contain exactly the three specified keys: \`medication_name\`, \`dosing_instructions\`, and \`quantity_dispensed\`.

Do not include any introductory text, concluding remarks, or markdown formatting (like \`\`\`json\`) before or after the JSON array. Your entire response should be the JSON data itself.
`;
}


export const extractMedicationsFromPrescription = async (
  prescriptionPart: {mimeType: string, data: string}
  ): Promise<ExtractedMedication[]> => {
    
    const prompt = getExtractionPrompt();
    
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          medication_name: { 
            type: Type.STRING,
            description: "The name of the medication."
          },
          dosing_instructions: { 
            type: Type.STRING,
            description: "The prescribed dosing instructions."
          },
          quantity_dispensed: { 
            type: Type.INTEGER,
            description: "The total quantity of medication dispensed."
           },
        },
        required: ['medication_name', 'dosing_instructions', 'quantity_dispensed'],
      }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [
            { inlineData: prescriptionPart },
            { text: prompt }
        ]},
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
    });

    return JSON.parse(response.text);
};


export const analyzeMedicationAdherence = async (
  medication: ExtractedMedication,
  photoPart: {mimeType: string, data: string}
): Promise<{daily_consumption: number}> => {

  const prompt = `
**SYSTEM INSTRUCTION: Medication Adherence Analyst**

You are an AI assistant specialized in calculating medication adherence. Your task is to determine the total number of units (tablets, capsules, etc.) a patient is instructed to take per day based on the provided dosing instructions and a photo of the medication.

**INPUT DATA:**
1.  **Dosing Instructions:** "${medication.dosing_instructions}"
2.  **Medication Photo:** An image of the product.

**GOAL:**
Analyze the dosing instructions. The photo is for context if needed but the primary source is the text. Calculate the total number of units consumed in a single 24-hour period.
- "twice daily", "BID" -> 2
- "three times a day", "TID" -> 3
- "every 8 hours" -> 3
- "every 12 hours" -> 2
- "once daily" -> 1

**OUTPUT SCHEMA:**
You MUST respond ONLY with a single, valid JSON object containing one key: \`daily_consumption\`. The value must be a number representing the total units per day.
Do not include any other text or markdown formatting.
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      daily_consumption: {
        type: Type.INTEGER,
        description: "Total number of units (pills, capsules, etc.) consumed per day."
      }
    },
    required: ["daily_consumption"]
  };
  
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [
          { inlineData: photoPart },
          { text: prompt }
      ]},
      config: {
        responseMimeType: "application/json",
        responseSchema,
      }
  });

  return JSON.parse(response.text);
};

export const verifyMedicationMatch = async (
    expectedMedicationName: string,
    photoPart: {mimeType: string, data: string}
): Promise<VerificationResult> => {

    const prompt = `
**SYSTEM INSTRUCTION: Medication Verification Specialist**

You are a specialized AI assistant for patient safety. Your task is to verify if the medication in an image matches the expected medication from a prescription.

**INPUT DATA:**
1.  **Expected Medication:** "${expectedMedicationName}"
2.  **Product Photo:** An image of the medication bottle or package.

**GOAL:**
1.  **Identify:** Read the label on the product in the image to identify the medication name.
2.  **Compare:** Compare the identified name with the "Expected Medication". A match is successful if the core medication names are the same, even if strength or brand differs (e.g., "Lisinopril 10mg" matches "Lisinopril").
3.  **Report:** Return your findings in the specified JSON format.

**OUTPUT SCHEMA:**
You MUST respond ONLY with a single, valid JSON object with two keys:
1.  \`match_status\`: A boolean. \`true\` if the names match, \`false\` otherwise.
2.  \`identified_product_name\`: A string containing the full name of the product as identified from the photo.

Do not include any other text or markdown formatting.
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            match_status: {
                type: Type.BOOLEAN,
                description: "True if the identified medication matches the expected one, false otherwise."
            },
            identified_product_name: {
                type: Type.STRING,
                description: "The full name of the medication identified in the product photo."
            }
        },
        required: ["match_status", "identified_product_name"]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [
            { inlineData: photoPart },
            { text: prompt }
        ]},
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
    });

    return JSON.parse(response.text);
};