import React from 'react';
import { useFormContext } from '@/lib/formContext';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProgressProps {
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ totalSteps }) => {
  const { currentStep, goToStep, formData, isCompleted } = useFormContext();
  
  // Define section names based on the form sections
  const sectionNames = [
    'General Information',
    'Incident Details',
    'Anxiety Symptoms',
    'Depression Symptoms',
    'Trauma Symptoms',
    'Social Support',
    'Physical Wellbeing',
    'Risk Assessment',
    'Expectations & Goals'
  ];
  
  // Function to check if a section has minimal required data
  const hasSectionData = (sectionIndex: number): boolean => {
    switch(sectionIndex) {
      case 0: // General Information
        return !!formData.generalInformation.age || !!formData.generalInformation.sex;
      case 1: // Incident Details
        return formData.incidentDetails.violenceTypes.length > 0;
      case 2: // Anxiety Symptoms
        return formData.anxietySymptoms.scores.some(score => score > 0);
      case 3: // Depression Symptoms
        return formData.depressionSymptoms.scores.some(score => score > 0);
      case 4: // Trauma Symptoms
        return formData.traumaSymptoms.ptsdScores.some(score => score > 0);
      case 5: // Social Support
        return formData.socialSupport.supportSources.length > 0;
      case 6: // Physical Wellbeing
        return !!formData.physicalWellbeing.overallHealth;
      case 7: // Risk Assessment
        return !!formData.riskAssessment.safetyFeeling;
      case 8: // Program Expectations
        return !!formData.programExpectations.expectations;
      default:
        return false;
    }
  };
  
  // Check if section has critical data values (high risk responses)
  const hasCriticalValue = (sectionIndex: number): boolean => {
    switch(sectionIndex) {
      case 2: // Anxiety Symptoms
        return formData.anxietySymptoms.totalScore >= 15;
      case 3: // Depression Symptoms
        return formData.depressionSymptoms.totalScore >= 20;
      case 4: // Trauma Symptoms
        return formData.traumaSymptoms.ptsdTotalScore >= 18;
      case 7: // Risk Assessment
        return formData.riskAssessment.suicidalThoughts === 'Active thoughts with plan' || 
               formData.riskAssessment.furtherHarmRisk === 'Immediate danger';
      default:
        return false;
    }
  };
  
  const handleStepClick = (index: number) => {
    if (!isCompleted) {
      goToStep(index);
    }
  };

  return (
    <div className="py-3 px-4 bg-white border-b">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="hidden lg:flex items-center justify-between w-full">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              {/* Step indicator with icon */}
              <div
                onClick={() => handleStepClick(index)}
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-colors",
                  isCompleted ? "cursor-not-allowed" : "hover:text-primary-700",
                  currentStep === index ? "text-primary-700" : "text-gray-500"
                )}
              >
                <div className="flex items-center mb-1">
                  {hasSectionData(index) ? (
                    hasCriticalValue(index) ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )
                  ) : (
                    <Circle 
                      className={cn(
                        "h-5 w-5",
                        currentStep === index ? "text-primary-500" : "text-gray-300"
                      )}
                    />
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    currentStep === index ? "text-primary-700" : "text-gray-500"
                  )}
                >
                  {sectionNames[index]}
                </span>
              </div>
              
              {/* Connector line between steps (except after the last step) */}
              {index < totalSteps - 1 && (
                <div 
                  className={cn(
                    "w-full h-0.5 mx-2 rounded-full max-w-10", 
                    index < currentStep ? "bg-primary-500" : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Mobile view: just show current step / total */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="text-gray-600 font-medium">
            <span className="text-primary-700">{currentStep + 1}</span> of {totalSteps}
          </div>
          <div className="text-sm text-gray-600 font-medium truncate pl-4 pr-2">
            {sectionNames[currentStep]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProgress;