import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from '@/lib/formContext';
import { formOptions } from '@/lib/assessmentUtils';

const ProgramExpectations: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const programData = formData.programExpectations;

  const handleInputChange = (field: string, value: any) => {
    updateFormData('programExpectations', { [field]: value });
  };

  const handlePriorityChange = (value: string, checked: boolean) => {
    const currentValues = [...programData.priorities];
    
    if (checked) {
      // Only allow up to 3 priorities
      if (currentValues.length < 3) {
        if (!currentValues.includes(value)) {
          updateFormData('programExpectations', { 
            priorities: [...currentValues, value] 
          });
        }
      }
    } else {
      updateFormData('programExpectations', { 
        priorities: currentValues.filter(item => item !== value) 
      });
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">9. Program Expectations and Goals</h2>
        <p className="text-gray-600 mb-6">
          Understanding the survivor's expectations and desired outcomes from psychosocial support.
        </p>

        <div className="space-y-6">
          {/* Expectations from psychosocial support */}
          <div>
            <Label htmlFor="expectations" className="block text-sm font-medium text-gray-700">Expectations from psychosocial support</Label>
            <p className="text-sm text-gray-500 mb-2">What do you hope to gain from counseling and support services?</p>
            <Textarea 
              id="expectations" 
              value={programData.expectations}
              onChange={(e) => handleInputChange('expectations', e.target.value)}
              rows={4} 
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Specific life changes desired */}
          <div>
            <Label htmlFor="life-changes" className="block text-sm font-medium text-gray-700">Specific life changes desired</Label>
            <p className="text-sm text-gray-500 mb-2">What specific changes would you like to see in your life through this process?</p>
            <Textarea 
              id="life-changes" 
              value={programData.lifeChanges}
              onChange={(e) => handleInputChange('lifeChanges', e.target.value)}
              rows={4} 
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Priorities for intervention */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Priorities for intervention (select top 3)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.priorityOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`priority-${option}`} 
                    checked={programData.priorities.includes(option)}
                    onCheckedChange={(checked) => handlePriorityChange(option, checked as boolean)}
                    disabled={!programData.priorities.includes(option) && programData.priorities.length >= 3}
                  />
                  <Label htmlFor={`priority-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
            {programData.priorities.length > 3 && (
              <p className="mt-2 text-sm text-red-600">Please select only your top 3 priorities.</p>
            )}
          </div>

          {/* Timeframe for Support */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Anticipated timeframe for support needed</Label>
            <RadioGroup 
              value={programData.timeframe} 
              onValueChange={(value) => handleInputChange('timeframe', value)}
              className="space-y-2"
            >
              {formOptions.timeframeOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem value={option} id={`timeframe-${index}`} />
                  <Label htmlFor={`timeframe-${index}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
              <div className="flex items-center">
                <RadioGroupItem value="Uncertain/don't know" id="timeframe-uncertain" />
                <Label htmlFor="timeframe-uncertain" className="ml-2 text-sm text-gray-700">Uncertain/don't know</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramExpectations;
