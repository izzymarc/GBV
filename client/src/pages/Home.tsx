import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmergencyResources from '@/components/EmergencyResources';
import { Shield, ArrowRight, Lock, Info, Save, Pause } from 'lucide-react';
import { useFormContext } from '@/lib/formContext';

const Home: React.FC = () => {
  const [_, navigate] = useLocation();
  const { resetForm } = useFormContext();

  const startAssessment = () => {
    resetForm();
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="text-primary-600 h-6 w-6 mr-3" />
              <h1 className="text-xl font-semibold text-gray-800">GBV Psychosocial Assessment Tool</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">GBV Psychosocial Assessment Tool</h2>
                <p className="text-gray-600 mb-6">A comprehensive evaluation for gender-based violence survivors</p>

                <Card className="bg-primary-50 mb-6 text-left">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-primary-700 mb-2">Before you begin:</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex">
                        <Lock className="text-primary-500 h-4 w-4 mt-1 mr-2" />
                        <span>All information provided is confidential and protected</span>
                      </li>
                      <li className="flex">
                        <Info className="text-primary-500 h-4 w-4 mt-1 mr-2" />
                        <span>Complete as many sections as appropriate; some sections may not apply</span>
                      </li>
                      <li className="flex">
                        <Save className="text-primary-500 h-4 w-4 mt-1 mr-2" />
                        <span>Progress is automatically saved as you complete each section</span>
                      </li>
                      <li className="flex">
                        <Pause className="text-primary-500 h-4 w-4 mt-1 mr-2" />
                        <span>You can take breaks and return to continue the assessment</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <EmergencyResources />

                <Button 
                  onClick={startAssessment}
                  className="mt-8 inline-flex items-center px-6 py-3 shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Begin Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
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

export default Home;
