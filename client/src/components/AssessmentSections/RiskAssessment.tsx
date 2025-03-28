import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { getRiskStatus } from "@/lib/assessmentUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const RiskAssessment: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { riskAssessment } = formData;

  const handleRadioChange = (field: string, value: string) => {
    updateFormData('riskAssessment', {
      [field]: value
    });
  };

  // Get risk status based on responses
  const riskStatus = getRiskStatus(
    riskAssessment.suicidalThoughts || '',
    riskAssessment.furtherHarmRisk || ''
  );

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Risk Assessment</h2>
              <p className="text-gray-500">Evaluating immediate safety concerns and risk factors</p>
            </div>
            {riskStatus.severity !== 'low' && (
              <Badge className={`text-sm px-3 py-1 ${
                riskStatus.severity === 'high' || riskStatus.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                'bg-orange-500 hover:bg-orange-600'
              }`}>
                {riskStatus.severity.charAt(0).toUpperCase() + riskStatus.severity.slice(1)} Risk
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            {/* Suicidal Thoughts */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium text-gray-900">
                Has the client had thoughts of suicide or self-harm in the past month? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={riskAssessment.suicidalThoughts || ''}
                onValueChange={(value) => handleRadioChange('suicidalThoughts', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No thoughts of self-harm" id="suicide-none" />
                  <Label htmlFor="suicide-none" className="cursor-pointer">No thoughts of self-harm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Passive thoughts without plan" id="suicide-passive" />
                  <Label htmlFor="suicide-passive" className="cursor-pointer">Passive thoughts without plan</Label>
                </div>
                <div className="flex items-center space-x-2 text-amber-800">
                  <RadioGroupItem value="Thoughts with vague plan" id="suicide-vague" />
                  <Label htmlFor="suicide-vague" className="cursor-pointer">Thoughts with vague plan</Label>
                </div>
                <div className="flex items-center space-x-2 text-red-800 font-medium">
                  <RadioGroupItem value="Active thoughts with specific plan" id="suicide-active" />
                  <Label htmlFor="suicide-active" className="cursor-pointer">Active thoughts with specific plan</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Further Harm Risk */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium text-gray-900">
                Is there a risk of further harm from the perpetrator? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={riskAssessment.furtherHarmRisk || ''}
                onValueChange={(value) => handleRadioChange('furtherHarmRisk', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No contact with perpetrator" id="harm-none" />
                  <Label htmlFor="harm-none" className="cursor-pointer">No contact with perpetrator</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Limited contact but feels safe" id="harm-limited" />
                  <Label htmlFor="harm-limited" className="cursor-pointer">Limited contact but feels safe</Label>
                </div>
                <div className="flex items-center space-x-2 text-amber-800">
                  <RadioGroupItem value="Ongoing contact with concerns" id="harm-concerns" />
                  <Label htmlFor="harm-concerns" className="cursor-pointer">Ongoing contact with concerns</Label>
                </div>
                <div className="flex items-center space-x-2 text-red-800 font-medium">
                  <RadioGroupItem value="Immediate danger from perpetrator" id="harm-immediate" />
                  <Label htmlFor="harm-immediate" className="cursor-pointer">Immediate danger from perpetrator</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Safety Feeling */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium text-gray-900">
                How safe does the client feel in their current living situation?
              </Label>
              <RadioGroup
                value={riskAssessment.safetyFeeling || ''}
                onValueChange={(value) => handleRadioChange('safetyFeeling', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Very safe" id="safety-very" />
                  <Label htmlFor="safety-very" className="cursor-pointer">Very safe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mostly safe" id="safety-mostly" />
                  <Label htmlFor="safety-mostly" className="cursor-pointer">Mostly safe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Somewhat unsafe" id="safety-somewhat" />
                  <Label htmlFor="safety-somewhat" className="cursor-pointer">Somewhat unsafe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Very unsafe" id="safety-very-unsafe" />
                  <Label htmlFor="safety-very-unsafe" className="cursor-pointer">Very unsafe</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Safety Plan */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium text-gray-900">
                Does the client need a safety plan?
              </Label>
              <RadioGroup
                value={riskAssessment.safetyPlanNeeded || ''}
                onValueChange={(value) => handleRadioChange('safetyPlanNeeded', value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="plan-yes" />
                  <Label htmlFor="plan-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="plan-no" />
                  <Label htmlFor="plan-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-6 border-t">
        {/* Risk Alerts */}
        {(riskStatus.severity === 'high' || riskStatus.severity === 'critical') && (
          <Alert className="w-full border-red-300 bg-red-50 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High Risk Alert</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Immediate intervention is recommended based on the client's responses. 
                Consider the following actions:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {riskAssessment.suicidalThoughts === 'Active thoughts with specific plan' && (
                  <li>Contact emergency mental health services or crisis intervention</li>
                )}
                {riskAssessment.furtherHarmRisk === 'Immediate danger from perpetrator' && (
                  <li>Develop an immediate safety plan and consider emergency shelter options</li>
                )}
                {riskAssessment.safetyFeeling === 'Very unsafe' && (
                  <li>Evaluate current living situation safety and alternatives</li>
                )}
                <li>Consider hospitalization or other intensive intervention if needed</li>
                <li>Do not leave the client alone until safety is established</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {riskStatus.severity === 'moderate' && (
          <Alert className="w-full border-orange-300 bg-orange-50 text-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Moderate Risk Alert</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Increased monitoring and intervention is recommended. Consider:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Creating a detailed safety plan</li>
                <li>Scheduled check-ins and increased session frequency</li>
                <li>Connecting with support resources (shelter, legal assistance, etc.)</li>
                <li>Providing crisis hotline numbers and emergency contacts</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {riskAssessment.safetyPlanNeeded === 'Yes' && (
          <Alert className="mt-4 w-full border-blue-300 bg-blue-50 text-blue-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Safety Plan Needed</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                A safety plan should be developed with the client, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identification of warning signs/triggers</li>
                <li>Coping strategies and distraction techniques</li>
                <li>People to contact for support (personal and professional)</li>
                <li>Steps to create a safe environment (removing means of self-harm)</li>
                <li>Emergency contact information and crisis resources</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default RiskAssessment;