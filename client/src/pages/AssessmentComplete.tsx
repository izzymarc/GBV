import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Download, FileDown, Home, Printer } from 'lucide-react';
import { useFormContext } from '@/lib/formContext';
import { 
  anxietyScoreInterpretation, 
  depressionScoreInterpretation, 
  traumaScoreInterpretation,
  getRiskStatus,
  getRecommendedInterventions
} from '@/lib/assessmentUtils';
import { generateAssessmentPDF, exportAssessmentJSON } from '@/lib/pdfGeneration';

const AssessmentComplete: React.FC = () => {
  const [_, navigate] = useLocation();
  const { formData, resetForm } = useFormContext();

  const anxietyScore = formData.anxietySymptoms.totalScore;
  const depressionScore = formData.depressionSymptoms.totalScore;
  const traumaScore = formData.traumaSymptoms.ptsdTotalScore;
  const suicidalThoughts = formData.riskAssessment.suicidalThoughts || '';
  const furtherHarmRisk = formData.riskAssessment.furtherHarmRisk || '';
  
  const anxietyResult = anxietyScoreInterpretation(anxietyScore);
  const depressionResult = depressionScoreInterpretation(depressionScore);
  const traumaResult = traumaScoreInterpretation(traumaScore);
  const riskStatus = getRiskStatus(suicidalThoughts, furtherHarmRisk);
  
  const recommendedInterventions = getRecommendedInterventions(
    anxietyScore,
    depressionScore,
    traumaScore,
    suicidalThoughts,
    furtherHarmRisk,
    formData.socialSupport.supportSources,
    formData.socialSupport.supportSatisfaction,
    formData.physicalWellbeing.physicalInjuries,
    formData.programExpectations.priorities
  );

  const handlePrintAssessment = () => {
    generateAssessmentPDF(formData);
  };

  const handleExportData = () => {
    exportAssessmentJSON(formData);
  };

  const handleGoHome = () => {
    resetForm();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Check className="text-primary-600 h-6 w-6 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">GBV Psychosocial Assessment Tool</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <CardContent className="px-4 py-5 sm:p-6 text-center">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">Assessment Complete</h2>
                <p className="mt-2 text-gray-600">Thank you for completing the GBV Psychosocial Assessment.</p>
              </div>

              <div className="max-w-2xl mx-auto bg-primary-50 p-6 rounded-lg text-left mb-6">
                <h3 className="text-lg font-semibold text-primary-800 mb-4">Assessment Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-primary-700">GAD-7 Score:</h4>
                    <p className={`text-lg font-bold ${anxietyResult.color}`}>
                      {anxietyScore} - {anxietyResult.level}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary-700">PHQ-9 Score:</h4>
                    <p className={`text-lg font-bold ${depressionResult.color}`}>
                      {depressionScore} - {depressionResult.level}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary-700">PCL-5 Score:</h4>
                    <p className={`text-lg font-bold ${traumaResult.color}`}>
                      {traumaScore} - {traumaResult.level}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary-700">Risk Status:</h4>
                    <p className={`text-lg font-bold ${riskStatus.color}`}>
                      {riskStatus.status}
                    </p>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-primary-700 mb-2">Recommended Interventions:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {recommendedInterventions.map((intervention, index) => (
                    <li key={index}>{intervention}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
            <Button 
              onClick={handlePrintAssessment}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Assessment
            </Button>
            
            <Button 
              onClick={handleExportData}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            
            <Button 
              onClick={handleGoHome}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
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

export default AssessmentComplete;
