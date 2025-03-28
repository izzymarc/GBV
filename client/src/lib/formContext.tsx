import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormData, formSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./queryClient";

// Default form data structure
const defaultFormData: FormData = {
  generalInformation: {
    age: "",
    sex: undefined,
    ethnicity: "",
    education: "",
    maritalStatus: "",
    dependents: "",
    livingArrangement: "",
    employmentStatus: "",
    vulnerabilities: [],
  },
  incidentDetails: {
    location: "",
    violenceTypes: [],
    perpetratorRelationship: "",
    frequency: "",
    exposure: "",
    reportingStatus: undefined,
    servicesReceived: "",
    outcome: "",
  },
  anxietySymptoms: {
    scores: [0, 0, 0, 0, 0, 0, 0],
    totalScore: 0,
  },
  depressionSymptoms: {
    scores: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalScore: 0,
  },
  traumaSymptoms: {
    ptsdScores: [0, 0, 0, 0, 0, 0],
    bondingScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ptsdTotalScore: 0,
    bondingTotalScore: 0,
  },
  socialSupport: {
    supportSources: [],
    supportSatisfaction: 3,
    copingMechanisms: [],
    previousTherapy: undefined,
    therapyDetails: "",
  },
  physicalWellbeing: {
    overallHealth: "",
    physicalInjuries: [],
    sexualHealthIssues: [],
    medicalCareAccessed: undefined,
    sleepDisturbances: [],
    workImpact: "",
    healthcareBarriers: [],
    unmetMedicalNeeds: "",
  },
  riskAssessment: {
    suicidalThoughts: "",
    safetyFeeling: "",
    furtherHarmRisk: "",
    safetyPlanNeeded: undefined,
  },
  programExpectations: {
    expectations: "",
    lifeChanges: "",
    priorities: [],
    timeframe: "",
  },
};

interface FormContextType {
  formData: FormData;
  currentStep: number;
  assessmentId: number | null;
  isCompleted: boolean;
  updateFormData: (section: keyof FormData, data: any) => void;
  saveForm: (isComplete?: boolean) => Promise<boolean>;
  resetForm: () => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { toast } = useToast();

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const saveForm = async (isComplete = false): Promise<boolean> => {
    try {
      const method = assessmentId ? "PUT" : "POST";
      const url = assessmentId 
        ? `/api/assessments/${assessmentId}` 
        : "/api/assessments";
      
      const response = await apiRequest(method, url, {
        data: formData,
        completed: isComplete,
      });
      
      const data = await response.json();
      
      if (!assessmentId) {
        setAssessmentId(data.id);
      }
      
      if (isComplete) {
        setIsCompleted(true);
      }
      
      toast({
        title: "Assessment saved",
        description: isComplete 
          ? "The assessment has been completed successfully." 
          : "Your progress has been saved.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error saving assessment",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    setAssessmentId(null);
    setIsCompleted(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        assessmentId,
        isCompleted,
        updateFormData,
        saveForm,
        resetForm,
        goToStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
