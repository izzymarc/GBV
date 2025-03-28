import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import EmergencyResources from '@/components/EmergencyResources';
import { 
  Shield, 
  ArrowRight, 
  Lock, 
  Info, 
  Save, 
  Pause, 
  FileText, 
  AlertCircle,
  Heart,
  Clock
} from 'lucide-react';
import { useFormContext } from '@/lib/formContext';

const Home: React.FC = () => {
  const [_, navigate] = useLocation();
  const { resetForm } = useFormContext();

  const startAssessment = () => {
    resetForm();
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="text-primary-600 h-7 w-7 mr-3" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                GBV Psychosocial Assessment Tool
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-8 md:px-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-full mb-6">
                  <Shield className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">GBV Psychosocial Assessment</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  A comprehensive evaluation tool designed to assess and support survivors of gender-based violence
                </p>
              </div>

              <Separator className="my-8" />
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <Card className="border-primary-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-semibold text-primary-700">
                      <Info className="h-5 w-5 mr-2" />
                      About This Tool
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm">
                    <p className="mb-4">
                      This digital assessment tool helps professionals document and evaluate the psychosocial needs 
                      of gender-based violence survivors using evidence-based scales and structured evaluation methods.
                    </p>
                    <div className="flex items-start mt-2">
                      <FileText className="h-4 w-4 text-primary-500 mt-0.5 mr-2" />
                      <span>Comprehensive 9-section assessment</span>
                    </div>
                    <div className="flex items-start mt-2">
                      <Heart className="h-4 w-4 text-primary-500 mt-0.5 mr-2" />
                      <span>Trauma-informed approach</span>
                    </div>
                    <div className="flex items-start mt-2">
                      <AlertCircle className="h-4 w-4 text-primary-500 mt-0.5 mr-2" />
                      <span>Risk identification and safety planning</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-semibold text-primary-700">
                      <Lock className="h-5 w-5 mr-2" />
                      Confidentiality & Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Lock className="text-primary-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <span>All information provided is confidential and protected</span>
                      </li>
                      <li className="flex items-start">
                        <Save className="text-primary-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Progress is automatically saved as you complete sections</span>
                      </li>
                      <li className="flex items-start">
                        <Pause className="text-primary-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <span>You can pause and resume the assessment at any time</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="text-primary-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Complete assessment takes approximately 20-30 minutes</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <EmergencyResources />

              <div className="text-center mt-10">
                <Button 
                  onClick={startAssessment}
                  size="lg"
                  className="inline-flex items-center px-8 py-6 text-lg font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
                >
                  Begin Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10">
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

export default Home;
