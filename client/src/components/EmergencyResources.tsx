import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, InfoIcon, PhoneCall } from 'lucide-react';

const EmergencyResources: React.FC = () => {
  return (
    <Card className="bg-secondary-50 border-secondary-200">
      <CardContent className="p-4 text-left">
        <h3 className="font-medium text-secondary-700 mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Need immediate help?
        </h3>
        <div className="text-sm text-gray-700">
          <p>If you or someone you know needs immediate assistance:</p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center">
              <PhoneCall className="h-4 w-4 text-secondary-700 mr-2" />
              <p className="font-medium">
                Call Emergency Services: 
                <span className="text-secondary-700 ml-1">911</span>
              </p>
            </div>
            
            <div className="flex items-center">
              <PhoneCall className="h-4 w-4 text-secondary-700 mr-2" />
              <p className="font-medium">
                GBV Hotline: 
                <span className="text-secondary-700 ml-1">1-800-799-7233</span>
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-secondary-200">
            <div className="flex items-start">
              <InfoIcon className="h-4 w-4 text-secondary-700 mr-2 mt-0.5" />
              <p className="text-xs">
                If you are in immediate danger, please seek help right away.
                These resources are available 24/7 and can provide immediate support and guidance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyResources;
