import React from 'react';
import { useFormContext } from '@/lib/formContext';

interface FormProgressProps {
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ totalSteps }) => {
  const { currentStep } = useFormContext();
  
  // Calculate progress percentage (subtract 1 from currentStep because steps are 0-indexed)
  const progress = currentStep === 0 ? 0 : Math.round(((currentStep) / (totalSteps)) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-medium text-primary-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default FormProgress;
