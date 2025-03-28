import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ClipboardCheck,
  Save,
  Home,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useFormContext } from '@/lib/formContext';
import { useToast } from '@/hooks/use-toast';
import FormProgress from '@/components/FormProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Import all assessment section components
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
  const { currentStep, nextStep, prevStep, saveForm, assessmentId } = useFormContext();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const TOTAL_STEPS = 9; // Total number of assessment sections

  const handlePrevious = () => {
    if (currentStep === 0) {
      // Go back to welcome page
      navigate('/');
    } else {
      prevStep();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveForm();
    setIsSaving(false);
    
    if (success) {
      toast({
        title: "Progress saved",
        description: "Your assessment progress has been saved successfully.",
      });
    }
  };

  const handleNext = async () => {
    // Save progress and move to next section
    setIsSaving(true);
    await saveForm();
    setIsSaving(false);
    nextStep();
    
    // Scroll to top when moving to next section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const success = await saveForm(true);
    setIsSaving(false);
    
    if (success) {
      toast({
        title: "Assessment completed",
        description: "Your assessment has been completed successfully.",
      });
      navigate('/assessment/complete');
    }
  };

  // Map step number to component
  const renderCurrentSection = () => {
    switch(currentStep) {
      case 0:
        return <GeneralInformation />;
      case 1:
        return <IncidentDetails />;
      case 2:
        return <AnxietySymptoms />;
      case 3:
        return <DepressionSymptoms />;
      case 4:
        return <TraumaSymptoms />;
      case 5:
        return <SocialSupport />;
      case 6:
        return <PhysicalWellbeing />;
      case 7:
        return <RiskAssessment />;
      case 8:
        return <ProgramExpectations />;
      default:
        return <GeneralInformation />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ClipboardCheck className="text-primary-600 h-7 w-7 mr-3" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                GBV Psychosocial Assessment Tool
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="hidden md:flex items-center"
              >
                <Home className="mr-1 h-4 w-4" />
                Home
              </Button>
              
              {assessmentId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save Progress
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Form Progress */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <FormProgress totalSteps={TOTAL_STEPS} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-md border-gray-200 bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 md:p-8">
                {/* Emergency Notice - shown only on sections with risk questions */}
                {[2, 3, 4, 7].includes(currentStep) && (
                  <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      If you notice signs of immediate danger or crisis, please contact emergency services 
                      or a crisis line immediately at <span className="font-bold">1-800-799-7233</span>.
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Render the current form section */}
                {renderCurrentSection()}
              </div>
              
              {/* Navigation Controls */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center font-semibold border-2 border-gray-300 hover:bg-gray-100"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentStep === 0 ? 'Back to Home' : 'Previous Section'}
                  </Button>

                  <div className="flex items-center space-x-3">
                    {/* Current step indicator for mobile */}
                    <span className="text-sm text-gray-700 font-medium hidden sm:inline-block">
                      Step {currentStep + 1} of {TOTAL_STEPS}
                    </span>
                    
                    {currentStep < TOTAL_STEPS - 1 ? (
                      <Button
                        onClick={handleNext}
                        disabled={isSaving}
                        className="bg-primary-700 hover:bg-primary-800 text-white font-semibold shadow-md px-5 py-6"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : null}
                        Save & Continue to Next Section
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleComplete}
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md px-5 py-6"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : null}
                        Save & Complete Assessment
                        <Check className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Instructions for users */}
          <div className="mt-6 text-sm text-gray-500 bg-white p-4 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-700 mb-2">Instructions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Complete each section as accurately as possible</li>
              <li>Your progress is automatically saved when moving between sections</li>
              <li>You can use the buttons at the bottom to navigate through the assessment</li>
              <li>The assessment must be completed in one session</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>GBV Psychosocial Assessment Tool &copy; {new Date().getFullYear()}</p>
            <p className="mt-2">For emergency assistance, call GBV Hotline: 1-800-799-7233</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentForm;
