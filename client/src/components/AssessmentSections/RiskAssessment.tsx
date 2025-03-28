import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from '@/lib/formContext';
import { formOptions } from '@/lib/assessmentUtils';
import { AlertTriangle } from 'lucide-react';

const RiskAssessment: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const riskData = formData.riskAssessment;

  const handleInputChange = (field: string, value: any) => {
    updateFormData('riskAssessment', { [field]: value });
  };

  const isInDanger = riskData.furtherHarmRisk === 'Immediate danger';
  const hasSuicidalRisk = riskData.suicidalThoughts === 'Active thoughts with plan';

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">8. Risk Assessment</h2>
          <div className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Critical Section</div>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                This section assesses immediate safety concerns. If the survivor reports suicidal thoughts or imminent danger, immediate intervention may be necessary.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Thoughts of self-harm/suicide */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Thoughts of self-harm/suicide</Label>
            <RadioGroup 
              value={riskData.suicidalThoughts} 
              onValueChange={(value) => handleInputChange('suicidalThoughts', value)}
              className="space-y-2"
            >
              {formOptions.suicidalThoughtOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem value={option} id={`suicide-${index}`} />
                  <Label htmlFor={`suicide-${index}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            
            {/* Crisis Alert */}
            {hasSuicidalRisk && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-md text-red-700 text-sm">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <strong>CRISIS ALERT:</strong> 
                    <p className="mt-1">The survivor has indicated active suicidal thoughts with a plan. This requires immediate crisis intervention.</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Do not leave the person alone</li>
                      <li>Contact emergency services or crisis response team immediately</li>
                      <li>Connect with a mental health professional as soon as possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feeling of safety */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Current feeling of safety</Label>
            <RadioGroup 
              value={riskData.safetyFeeling} 
              onValueChange={(value) => handleInputChange('safetyFeeling', value)}
              className="space-y-2"
            >
              {formOptions.safetyFeelingOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem value={option} id={`safety-${option}`} />
                  <Label htmlFor={`safety-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Risk of further harm */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Risk of further harm from perpetrator</Label>
            <RadioGroup 
              value={riskData.furtherHarmRisk} 
              onValueChange={(value) => handleInputChange('furtherHarmRisk', value)}
              className="space-y-2"
            >
              {formOptions.furtherHarmRiskOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem value={option} id={`risk-${option}`} />
                  <Label htmlFor={`risk-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            
            {/* Danger Alert */}
            {isInDanger && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-md text-red-700 text-sm">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <strong>DANGER ALERT:</strong> 
                    <p className="mt-1">The survivor has indicated they are in immediate danger. This requires urgent safety planning and potential intervention.</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Contact local law enforcement if immediate physical danger exists</li>
                      <li>Connect with domestic violence/GBV emergency services</li>
                      <li>Discuss and implement an immediate safety plan</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Need for safety plan */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Need for safety plan</Label>
            <RadioGroup 
              value={riskData.safetyPlanNeeded} 
              onValueChange={(value) => handleInputChange('safetyPlanNeeded', value as 'Yes' | 'No')}
              className="space-y-2"
            >
              <div className="flex items-center">
                <RadioGroupItem value="Yes" id="safety-plan-yes" />
                <Label htmlFor="safety-plan-yes" className="ml-2 text-sm text-gray-700">Yes</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="No" id="safety-plan-no" />
                <Label htmlFor="safety-plan-no" className="ml-2 text-sm text-gray-700">No</Label>
              </div>
            </RadioGroup>

            {riskData.safetyPlanNeeded === 'Yes' && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Safety Plan Resources</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Identify trusted contacts for emergencies</li>
                  <li>Create a "go bag" with essential documents and necessities</li>
                  <li>Establish code words with trusted friends/family</li>
                  <li>Map safe locations (police stations, shelters, hospitals)</li>
                  <li>Document evidence of abuse (if safe to do so)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
