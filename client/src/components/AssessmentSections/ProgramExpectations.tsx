import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { getRecommendedInterventions } from "@/lib/assessmentUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Lightbulb } from 'lucide-react';

const ProgramExpectations: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { programExpectations, riskAssessment } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('programExpectations', {
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    updateFormData('programExpectations', {
      [field]: value
    });
  };

  const handlePriorityChange = (value: string, checked: boolean) => {
    const currentPriorities = [...programExpectations.priorities];
    
    if (checked) {
      // Only allow up to 3 priorities
      if (currentPriorities.length < 3) {
        if (!currentPriorities.includes(value)) {
          updateFormData('programExpectations', {
            priorities: [...currentPriorities, value]
          });
        }
      }
    } else {
      updateFormData('programExpectations', {
        priorities: currentPriorities.filter(v => v !== value)
      });
    }
  };

  // Get recommendations based on the risk assessment
  const recommendedInterventions = getRecommendedInterventions(
    riskAssessment.suicidalThoughts || '', 
    riskAssessment.furtherHarmRisk || ''
  );

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Program Expectations and Goals</h2>
            <p className="text-gray-500 mb-6">Understanding the client's expectations and establishing treatment goals</p>
          </div>

          <div className="space-y-6">
            {/* Expectations */}
            <div className="space-y-2">
              <Label htmlFor="expectations">What does the client hope to gain from services?</Label>
              <Textarea
                id="expectations"
                name="expectations"
                value={programExpectations.expectations || ''}
                onChange={handleInputChange}
                placeholder="Describe the client's expectations and hopes for the program..."
                className="min-h-[100px]"
              />
            </div>

            {/* Life Changes */}
            <div className="space-y-2">
              <Label htmlFor="lifeChanges">What changes would the client like to see in their life?</Label>
              <Textarea
                id="lifeChanges"
                name="lifeChanges"
                value={programExpectations.lifeChanges || ''}
                onChange={handleInputChange}
                placeholder="Describe the client's desired changes and outcomes..."
                className="min-h-[100px]"
              />
            </div>

            <Separator />

            {/* Priorities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Treatment Priorities (select up to 3)</Label>
                <span className="text-sm text-gray-500">{programExpectations.priorities.length}/3 selected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Safety planning',
                  'Trauma processing',
                  'Anxiety management',
                  'Depression management',
                  'Legal advocacy',
                  'Housing assistance',
                  'Financial support',
                  'Medical care',
                  'Family support',
                  'Employment assistance',
                  'Substance use treatment',
                  'Parenting support'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`priority-${option}`}
                      checked={programExpectations.priorities.includes(option)}
                      onCheckedChange={(checked) => handlePriorityChange(option, !!checked)}
                      disabled={!programExpectations.priorities.includes(option) && programExpectations.priorities.length >= 3}
                    />
                    <Label 
                      htmlFor={`priority-${option}`}
                      className={`text-sm font-normal cursor-pointer ${
                        !programExpectations.priorities.includes(option) && programExpectations.priorities.length >= 3 
                          ? 'text-gray-400' 
                          : ''
                      }`}
                    >
                      {option}
                      {recommendedInterventions.includes(option) && (
                        <span className="ml-1 text-xs text-blue-600">(Recommended)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeframe */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Expected Timeframe for Services</Label>
              <RadioGroup
                value={programExpectations.timeframe || ''}
                onValueChange={(value) => handleRadioChange('timeframe', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Short-term (1-3 months)" id="time-short" />
                  <Label htmlFor="time-short" className="cursor-pointer">Short-term (1-3 months)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium-term (3-6 months)" id="time-medium" />
                  <Label htmlFor="time-medium" className="cursor-pointer">Medium-term (3-6 months)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Long-term (6+ months)" id="time-long" />
                  <Label htmlFor="time-long" className="cursor-pointer">Long-term (6+ months)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ongoing/Indefinite" id="time-ongoing" />
                  <Label htmlFor="time-ongoing" className="cursor-pointer">Ongoing/Indefinite</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-6 border-t">
        {/* Professional Recommendations */}
        <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Professional Recommendations</h3>
              
              {recommendedInterventions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-blue-700 mb-1">
                    Based on the assessment, consider the following interventions:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                    {recommendedInterventions.map((intervention, index) => (
                      <li key={index}>{intervention}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-blue-700">
                  Complete the Risk Assessment section for tailored intervention recommendations.
                </p>
              )}
              
              <p className="text-sm text-blue-700 mt-3">
                These recommendations should be discussed with the client and incorporated into the 
                treatment plan based on the client's preferences and priorities.
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProgramExpectations;