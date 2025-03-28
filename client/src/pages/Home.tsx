import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmergencyResources from '@/components/EmergencyResources';
import { 
  ShieldCheck, 
  ArrowRight, 
  LockKeyhole, 
  FileBarChart, 
  Save, 
  Clock,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  BrainCircuit,
  Users,
  Download,
  Shield,
  Sparkles
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-800">
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        {/* Header */}
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ShieldCheck className="text-white h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold text-white">
                  GBV Assessment Platform
                </h1>
              </div>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/20"
                onClick={() => window.open("https://www.un.org/en/spotlight-initiative/resources.shtml", "_blank")}
              >
                Resources
              </Button>
            </div>
          </div>
        </header>
        
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">Professional Assessment Tool</Badge>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Gender-Based Violence <span className="text-blue-100">Psychosocial Assessment</span>
              </h2>
              <p className="text-lg text-blue-50 mb-8 max-w-lg">
                A comprehensive, trauma-informed evaluation platform for professionals 
                supporting survivors of gender-based violence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={startAssessment}
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  Begin Assessment
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white px-6 py-6 text-lg font-medium"
                  onClick={() => navigate('#features')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-400 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-blue-400 rounded-full opacity-10"></div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 transform rotate-2">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-white/20 rounded-md w-full"></div>
                  <div className="h-6 bg-white/20 rounded-md w-3/4"></div>
                  <div className="h-6 bg-white/20 rounded-md w-5/6"></div>
                  <div className="h-20 bg-white/20 rounded-md w-full mt-4"></div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="h-8 bg-blue-500/30 rounded-md"></div>
                    <div className="h-8 bg-white/20 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract Shapes Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-32 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-16" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features Section */}
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200">Platform Features</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Designed for Professional Care Providers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers a structured approach to support your work with gender-based violence survivors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="border-none shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <ClipboardCheck className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Comprehensive Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A structured 9-section evaluation covering all aspects of psychosocial well-being for survivors of gender-based violence.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Validated methodology</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <HeartPulse className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Trauma-Informed Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built with sensitivity to trauma responses, providing a safe and supportive assessment experience for both providers and survivors.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Evidence-based approach</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Psychological Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Integrated scales for anxiety, depression, and trauma symptoms with automatic scoring and severity assessment.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Clinical metrics</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Process Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200">Assessment Process</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Structured and Efficient Assessment Flow</h2>
              <p className="text-gray-600 mb-6">
                Our platform streamlines the assessment process while maintaining thoroughness. 
                Complete evaluations in approximately 20-30 minutes with comprehensive documentation.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-blue-700 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Gather General Information</h3>
                    <p className="text-gray-600">Collect essential demographic and contextual information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-blue-700 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Screen for Mental Health</h3>
                    <p className="text-gray-600">Evaluate anxiety, depression, and trauma symptoms</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-blue-700 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Assess Risk Factors</h3>
                    <p className="text-gray-600">Identify safety concerns and intervention priorities</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-blue-700 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Generate Report</h3>
                    <p className="text-gray-600">Create comprehensive assessment documentation</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden border border-gray-100">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileBarChart className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Assessment Features</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Professional</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Save className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Automatic Saving</h4>
                      <p className="text-sm text-gray-500">Progress saved as you complete sections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Social Support Assessment</h4>
                      <p className="text-sm text-gray-500">Evaluate available support networks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <LockKeyhole className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Confidential Data</h4>
                      <p className="text-sm text-gray-500">All information is protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Download className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Exportable Reports</h4>
                      <p className="text-sm text-gray-500">Download assessment as PDF</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Time Efficient</h4>
                      <p className="text-sm text-gray-500">Complete in 20-30 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-20 -ml-8 -mb-8"></div>
            </div>
          </div>
          
          {/* Emergency Resources */}
          <div className="mb-16">
            <EmergencyResources />
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-8 py-12 md:p-12 relative">
              <div className="max-w-2xl relative z-10">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">Ready to Begin</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Start a New Assessment
                </h2>
                <p className="text-blue-100 mb-8">
                  Complete psychosocial assessments with a structured, trauma-informed approach that 
                  helps identify needs and guide intervention planning.
                </p>
                <Button 
                  onClick={startAssessment}
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all flex items-center"
                >
                  Begin Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              {/* Decorative Elements */}
              <div className="hidden md:block absolute right-12 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-32 w-32 text-white/20" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="text-blue-600 h-6 w-6 mr-2" />
              <span className="font-semibold text-gray-900">GBV Psychosocial Assessment Tool</span>
            </div>
            <div className="text-center md:text-right text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} GBV Assessment Platform</p>
              <p className="mt-1"><strong>Emergency Hotline:</strong> 1-800-799-7233</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
