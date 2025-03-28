import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions } from "@/lib/assessmentUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from '@/components/ui/progress';
import { Slider } from "@/components/ui/slider";

const SocialSupport: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { socialSupport } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('socialSupport', {
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    updateFormData('socialSupport', {
      [field]: value
    });
  };

  const handleSupportSourceChange = (value: string, checked: boolean) => {
    const currentSources = [...socialSupport.supportSources];
    
    if (checked) {
      if (!currentSources.includes(value)) {
        updateFormData('socialSupport', {
          supportSources: [...currentSources, value]
        });
      }
    } else {
      updateFormData('socialSupport', {
        supportSources: currentSources.filter(v => v !== value)
      });
    }
  };

  const handleCopingMechanismChange = (value: string, checked: boolean) => {
    const currentMechanisms = [...socialSupport.copingMechanisms];
    
    if (checked) {
      if (!currentMechanisms.includes(value)) {
        updateFormData('socialSupport', {
          copingMechanisms: [...currentMechanisms, value]
        });
      }
    } else {
      updateFormData('socialSupport', {
        copingMechanisms: currentMechanisms.filter(v => v !== value)
      });
    }
  };

  const handleSatisfactionChange = (value: number[]) => {
    updateFormData('socialSupport', {
      supportSatisfaction: value[0]
    });
  };

  // Calculate social support score (based on support sources and satisfaction)
  const calculateSupportScore = (): number => {
    let score = 0;
    
    // Add 1 point for each support source (max 5 points)
    const supportSourcesScore = Math.min(socialSupport.supportSources.length, 5);
    score += supportSourcesScore;
    
    // Add support satisfaction score (1-5)
    score += socialSupport.supportSatisfaction;
    
    // Add 1 point for each healthy coping mechanism (max 4 points)
    const healthyCopingMechanisms = socialSupport.copingMechanisms.filter(
      m => ['Exercise', 'Meditation', 'Talking to friends', 'Therapy', 'Art/Creative activities', 'Nature/Outdoors'].includes(m)
    );
    const copingScore = Math.min(healthyCopingMechanisms.length, 4);
    score += copingScore;
    
    return score;
  };

  const supportScore = calculateSupportScore();
  const maxScore = 14; // Max possible score (5 + 5 + 4)
  const supportPercentage = (supportScore / maxScore) * 100;

  // Determine support level
  const getSupportLevel = () => {
    if (supportScore >= 10) return { level: 'Strong Support Network', color: 'text-green-600' };
    if (supportScore >= 6) return { level: 'Moderate Support Network', color: 'text-yellow-600' };
    return { level: 'Limited Support Network', color: 'text-red-600' };
  };

  const supportLevel = getSupportLevel();

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Social Support Assessment</h2>
            <p className="text-gray-500 mb-6">Evaluating the client's support network and resources</p>
          </div>

          <div className="space-y-6">
            {/* Support Sources */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium">Sources of Support (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Family', 'Friends', 'Partner/Spouse', 'Religious community', 'Support groups', 'Mental health professionals', 'Social services', 'Coworkers', 'Neighbors', 'Online communities'].map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`source-${source}`}
                      checked={socialSupport.supportSources.includes(source)}
                      onCheckedChange={(checked) => handleSupportSourceChange(source, !!checked)}
                    />
                    <Label 
                      htmlFor={`source-${source}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {source}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Satisfaction */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium">Support Satisfaction</Label>
              <p className="text-sm text-gray-500 mb-4">How satisfied is the client with the support they receive?</p>
              
              <div className="space-y-6">
                <Slider
                  value={[socialSupport.supportSatisfaction]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={handleSatisfactionChange}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 - Very dissatisfied</span>
                  <span>3 - Neutral</span>
                  <span>5 - Very satisfied</span>
                </div>

                <div className="flex items-center justify-center">
                  <div className={`text-center py-2 px-5 rounded-full ${
                    socialSupport.supportSatisfaction >= 4 ? 'bg-green-100 text-green-800' :
                    socialSupport.supportSatisfaction >= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <span className="text-lg font-semibold">{socialSupport.supportSatisfaction}</span>
                    <span className="text-sm ml-2">{
                      socialSupport.supportSatisfaction >= 4 ? 'Satisfied' :
                      socialSupport.supportSatisfaction >= 3 ? 'Neutral' :
                      'Dissatisfied'
                    }</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Coping Mechanisms */}
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
              <Label className="text-base font-medium">Coping Mechanisms (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Exercise', 'Meditation', 'Talking to friends', 'Therapy', 'Art/Creative activities', 'Nature/Outdoors', 
                  'Substance use', 'Isolation', 'Work/Busyness', 'Sleep', 'Religion/Spirituality', 'Helping others'].map((coping) => (
                  <div key={coping} className={`flex items-center space-x-2 ${
                    ['Substance use', 'Isolation'].includes(coping) ? 'text-amber-800' : ''
                  }`}>
                    <Checkbox 
                      id={`coping-${coping}`}
                      checked={socialSupport.copingMechanisms.includes(coping)}
                      onCheckedChange={(checked) => handleCopingMechanismChange(coping, !!checked)}
                    />
                    <Label 
                      htmlFor={`coping-${coping}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {coping}
                      {['Substance use', 'Isolation'].includes(coping) && 
                        <span className="ml-1 text-xs text-amber-600">(concerning)</span>
                      }
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Therapy */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Has the client received therapy or counseling before?</Label>
              <RadioGroup
                value={socialSupport.previousTherapy || ''}
                onValueChange={(value) => handleRadioChange('previousTherapy', value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="therapy-yes" />
                  <Label htmlFor="therapy-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="therapy-no" />
                  <Label htmlFor="therapy-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Therapy Details */}
            {socialSupport.previousTherapy === 'Yes' && (
              <div className="space-y-2">
                <Label htmlFor="therapyDetails">Details about previous therapy experience</Label>
                <Textarea
                  id="therapyDetails"
                  name="therapyDetails"
                  value={socialSupport.therapyDetails || ''}
                  onChange={handleInputChange}
                  placeholder="What type of therapy, for how long, was it helpful, etc."
                  className="min-h-[80px]"
                />
              </div>
            )}

            {/* Support Summary */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Social Support Score: {supportScore}/{maxScore}</h3>
                <span className={supportLevel.color}>{supportLevel.level}</span>
              </div>
              
              <Progress 
                value={supportPercentage} 
                className={`h-2 ${
                  supportPercentage >= 70 ? 'bg-green-500' : 
                  supportPercentage >= 40 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
              />
              
              <div className="grid grid-cols-3 text-xs text-gray-500 mt-1">
                <div>Limited (0-5)</div>
                <div className="text-center">Moderate (6-9)</div>
                <div className="text-right">Strong (10-14)</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSupport;