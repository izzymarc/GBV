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
    <div className="py-4 px-4 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Generate all step indicators */}
          {Array.from({ length: totalSteps }).map((_, index) => {
            // Determine which icon to show
            let StepIcon = Circle;
            let iconColorClass = currentStep === index ? "text-primary-600 fill-blue-100" : "text-gray-400";
            
            if (hasSectionData(index)) {
              if (hasCriticalValue(index)) {
                StepIcon = AlertTriangle;
                iconColorClass = "text-red-500";
              } else {
                StepIcon = CheckCircle;
                iconColorClass = "text-green-500";
              }
            }
            
            return (
              <div key={`step-container-${index}`} className="flex items-center">
                {/* Step indicator */}
                <div
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-colors px-2 py-1 rounded-md",
                    isCompleted ? "cursor-not-allowed" : "hover:bg-gray-50 hover:text-primary-700",
                    currentStep === index ? "bg-blue-50 text-primary-700 border border-blue-200" : "text-gray-600"
                  )}
                >
                  <div className="flex items-center mb-2">
                    <StepIcon className={cn("h-6 w-6", iconColorClass)} />
                  </div>
                  <span 
                    className={cn(
                      "text-sm font-medium whitespace-nowrap text-center",
                      currentStep === index ? "text-primary-700 font-semibold" : "text-gray-600"
                    )}
                  >
                    {sectionNames[index]}
                  </span>
                </div>
                
                {/* Connector line (except after the last step) */}
                {index < totalSteps - 1 && (
                  <div 
                    className={cn(
                      "w-full h-1 mx-2 rounded-full max-w-12", 
                      index < currentStep ? "bg-primary-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Mobile view: just show current step / total with clearer section name */}
        <div className="lg:hidden flex flex-col w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-700 font-semibold">
              Section <span className="text-primary-700 font-bold">{currentStep + 1}</span> of {totalSteps}
            </div>
            <div className="text-sm bg-blue-50 text-primary-700 font-medium px-3 py-1 rounded-full border border-blue-200">
              {currentStep + 1}/{totalSteps}
            </div>
          </div>
          <div className="text-lg text-gray-800 font-semibold py-1">
            {sectionNames[currentStep]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProgress;