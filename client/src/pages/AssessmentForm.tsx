import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, ArrowLeft, ArrowRight, Check, ClipboardCheck } from 'lucide-react';
import { useFormContext } from '@/lib/formContext';
import FormProgress from '@/components/FormProgress';
import GeneralInformation from '@/components/AssessmentSections/GeneralInformation';
import IncidentDetails from '@/components/AssessmentSections/IncidentDetails';
import AnxietySymptoms from '@/components/AssessmentSections/AnxietySymptoms';
import DepressionSymptoms from '@/components/AssessmentSections/DepressionSymptoms';
import TraumaSymptoms from '@/components/AssessmentSections/TraumaSymptoms';
import SocialSupport from '@/components/AssessmentSections/SocialSupport';
import PhysicalWellbeing from '@/components/AssessmentSections/PhysicalWellbeing';
import RiskAssessment from '@/components/AssessmentSections/RiskAssessment';
import ProgramExpectations from '@/components/AssessmentSections/ProgramExpectations';

const AssessmentForm: React.FC = () => {
  const [_, navigate] = useLocation();
  const { currentStep, nextStep, prevStep, saveForm } = useFormContext();
  const [isSaving, setIsSaving] = useState(false);

  const TOTAL_STEPS = 9; // Total number of assessment sections

  const handlePrevious = () => {
    if (currentStep === 1) {
      // Go back to welcome page
      navigate('/');
    } else {
      prevStep();
    }
  };

  const handleNext = async () => {
    // Save progress
    setIsSaving(true);
    await saveForm();
    setIsSaving(false);
    nextStep();
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const success = await saveForm(true);
    setIsSaving(false);
    
    if (success) {
      navigate('/assessment/complete');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ClipboardCheck className="text-primary-600 h-6 w-6 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">GBV Psychosocial Assessment Tool</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Progress Bar */}
          {currentStep > 0 && <FormProgress totalSteps={TOTAL_STEPS} />}

          {/* Form Sections */}
          {currentStep === 1 && <GeneralInformation />}
          {currentStep === 2 && <IncidentDetails />}
          {currentStep === 3 && <AnxietySymptoms />}
          {currentStep === 4 && <DepressionSymptoms />}
          {currentStep === 5 && <TraumaSymptoms />}
          {currentStep === 6 && <SocialSupport />}
          {currentStep === 7 && <PhysicalWellbeing />}
          {currentStep === 8 && <RiskAssessment />}
          {currentStep === 9 && <ProgramExpectations />}

          {/* Navigation Buttons */}
          <div className="mt-6">
            <Card className="bg-gray-50 shadow-sm">
              <CardContent className="px-4 py-3 flex justify-between items-center">
                <Button
                  onClick={handlePrevious}
                  className="inline-flex items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {currentStep === 1 ? 'Back to Home' : 'Previous'}
                </Button>

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    onClick={handleNext}
                    disabled={isSaving}
                    className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Next Section
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={isSaving}
                    className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Complete Assessment
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>GBV Psychosocial Assessment Tool &copy; 2023</p>
            <p className="mt-1">For emergency assistance, call GBV Hotline: 1-800-799-7233</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentForm;
