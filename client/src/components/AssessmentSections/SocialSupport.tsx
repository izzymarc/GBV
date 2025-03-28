import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useFormContext } from '@/lib/formContext';
import { formOptions } from '@/lib/assessmentUtils';

const SocialSupport: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const socialData = formData.socialSupport;

  const handleInputChange = (field: string, value: any) => {
    updateFormData('socialSupport', { [field]: value });
  };

  const handleSupportSourceChange = (value: string, checked: boolean) => {
    const currentValues = [...socialData.supportSources];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!currentValues.includes(value)) {
        updateFormData('socialSupport', { 
          supportSources: [...currentValues, value] 
        });
      }
    } else {
      // Remove the value
      updateFormData('socialSupport', { 
        supportSources: currentValues.filter(item => item !== value) 
      });
    }
  };

  const handleCopingMechanismChange = (value: string, checked: boolean) => {
    const currentValues = [...socialData.copingMechanisms];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!currentValues.includes(value)) {
        updateFormData('socialSupport', { 
          copingMechanisms: [...currentValues, value] 
        });
      }
    } else {
      // Remove the value
      updateFormData('socialSupport', { 
        copingMechanisms: currentValues.filter(item => item !== value) 
      });
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">6. Social Support and Coping</h2>
        <p className="text-gray-600 mb-6">
          This section evaluates the support systems and coping mechanisms available to the survivor.
        </p>

        <div className="space-y-6">
          {/* Sources of support */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Sources of support (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.supportSourceOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`support-${option}`} 
                    checked={socialData.supportSources.includes(option)}
                    onCheckedChange={(checked) => handleSupportSourceChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`support-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction with support */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction with support</Label>
            <div className="flex items-center space-x-1">
              <Slider
                value={[socialData.supportSatisfaction]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => handleInputChange('supportSatisfaction', value[0])}
                className="w-full h-2"
              />
              <span className="text-sm text-gray-600 ml-2 w-6">{socialData.supportSatisfaction}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Dissatisfied</span>
              <span>Very Satisfied</span>
            </div>
          </div>

          {/* Coping mechanisms */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Coping mechanisms (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.copingMechanismOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`coping-${option}`} 
                    checked={socialData.copingMechanisms.includes(option)}
                    onCheckedChange={(checked) => handleCopingMechanismChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`coping-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Previous counseling or therapy experiences */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Previous counseling or therapy experiences</Label>
            <div className="space-y-2">
              <RadioGroup 
                value={socialData.previousTherapy} 
                onValueChange={(value) => handleInputChange('previousTherapy', value as 'Yes' | 'No')}
              >
                <div className="flex items-center">
                  <RadioGroupItem value="Yes" id="prev-therapy-yes" />
                  <Label htmlFor="prev-therapy-yes" className="ml-2 text-sm text-gray-700">Yes</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="No" id="prev-therapy-no" />
                  <Label htmlFor="prev-therapy-no" className="ml-2 text-sm text-gray-700">No</Label>
                </div>
              </RadioGroup>
              
              {socialData.previousTherapy === 'Yes' && (
                <div className="mt-3">
                  <Label htmlFor="therapy-details" className="block text-sm font-medium text-gray-700">Please describe your experience:</Label>
                  <Textarea 
                    id="therapy-details" 
                    value={socialData.therapyDetails}
                    onChange={(e) => handleInputChange('therapyDetails', e.target.value)}
                    rows={3} 
                    className="mt-1 block w-full rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSupport;
