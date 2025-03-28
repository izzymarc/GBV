import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, InfoIcon, PhoneCall, ExternalLink, Shield, HelpCircle } from 'lucide-react';

const EmergencyResources: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold enhanced-red-text">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Crisis Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 text-left">
        <p className="text-sm text-gray-700 mb-3">
          If you or someone you know needs immediate assistance:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-red-100 shadow-sm">
            <div className="flex items-center enhanced-red-text font-medium mb-1">
              <PhoneCall className="h-4 w-4 mr-2" />
              Emergency Services
            </div>
            <a href="tel:911" className="flex items-center hover:text-red-600">
              <span className="text-lg font-bold">911</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <p className="text-xs text-gray-600 mt-1">For immediate danger situations</p>
          </div>
          
          <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-red-100 shadow-sm">
            <div className="flex items-center enhanced-red-text font-medium mb-1">
              <PhoneCall className="h-4 w-4 mr-2" />
              GBV Hotline
            </div>
            <a href="tel:18007997233" className="flex items-center hover:text-red-600">
              <span className="text-lg font-bold">1-800-799-7233</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <p className="text-xs text-gray-600 mt-1">Domestic violence support</p>
          </div>
        </div>
        
        <div className="flex items-start bg-white bg-opacity-50 p-3 rounded-lg border border-red-100">
          <HelpCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">Available 24/7 Resources:</p>
            <ul className="text-xs text-gray-700 mt-1 space-y-1">
              <li className="flex items-center">
                <Shield className="h-3 w-3 text-red-500 mr-1" />
                Crisis counseling and safety planning
              </li>
              <li className="flex items-center">
                <Shield className="h-3 w-3 text-red-500 mr-1" />
                Connection to local support services
              </li>
              <li className="flex items-center">
                <Shield className="h-3 w-3 text-red-500 mr-1" />
                Multilingual advocates available
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyResources;
