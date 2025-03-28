import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from '@/lib/formContext';
import { formOptions } from '@/lib/assessmentUtils';

const PhysicalWellbeing: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const physicalData = formData.physicalWellbeing;
  const incidentDetails = formData.incidentDetails;
  const hasSexualViolence = incidentDetails.violenceTypes.some(type => 
    ['Sexual Assault', 'Rape', 'Defilement'].includes(type)
  );

  const handleInputChange = (field: string, value: any) => {
    updateFormData('physicalWellbeing', { [field]: value });
  };

  const handlePhysicalInjuriesChange = (value: string, checked: boolean) => {
    const currentValues = [...physicalData.physicalInjuries];
    
    if (checked) {
      if (!currentValues.includes(value)) {
        updateFormData('physicalWellbeing', { 
          physicalInjuries: [...currentValues, value] 
        });
      }
    } else {
      updateFormData('physicalWellbeing', { 
        physicalInjuries: currentValues.filter(item => item !== value) 
      });
    }
  };

  const handleSexualHealthIssuesChange = (value: string, checked: boolean) => {
    const currentValues = [...physicalData.sexualHealthIssues];
    
    if (checked) {
      if (!currentValues.includes(value)) {
        updateFormData('physicalWellbeing', { 
          sexualHealthIssues: [...currentValues, value] 
        });
      }
    } else {
      updateFormData('physicalWellbeing', { 
        sexualHealthIssues: currentValues.filter(item => item !== value) 
      });
    }
  };

  const handleSleepDisturbancesChange = (value: string, checked: boolean) => {
    const currentValues = [...physicalData.sleepDisturbances];
    
    if (checked) {
      if (!currentValues.includes(value)) {
        updateFormData('physicalWellbeing', { 
          sleepDisturbances: [...currentValues, value] 
        });
      }
    } else {
      updateFormData('physicalWellbeing', { 
        sleepDisturbances: currentValues.filter(item => item !== value) 
      });
    }
  };

  const handleHealthcareBarriersChange = (value: string, checked: boolean) => {
    const currentValues = [...physicalData.healthcareBarriers];
    
    if (checked) {
      if (!currentValues.includes(value)) {
        updateFormData('physicalWellbeing', { 
          healthcareBarriers: [...currentValues, value] 
        });
      }
    } else {
      updateFormData('physicalWellbeing', { 
        healthcareBarriers: currentValues.filter(item => item !== value) 
      });
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">7. Physical and Functional Well-being</h2>
        <p className="text-gray-600 mb-6">
          Assessment of physical health impacts and daily functioning.
        </p>

        <div className="space-y-6">
          <h3 className="text-md font-semibold text-gray-700">General Physical Health</h3>
          
          {/* Description of overall health */}
          <div>
            <Label htmlFor="overall-health" className="block text-sm font-medium text-gray-700">Description of overall health</Label>
            <Select 
              value={physicalData.overallHealth} 
              onValueChange={(value) => handleInputChange('overallHealth', value)}
            >
              <SelectTrigger id="overall-health" className="w-full">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.overallHealthOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Physical Injuries & Conditions */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Physical injuries or conditions due to violence (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.physicalInjuryOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`injury-${option}`} 
                    checked={physicalData.physicalInjuries.includes(option)}
                    onCheckedChange={(checked) => handlePhysicalInjuriesChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`injury-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {hasSexualViolence && (
            <>
              <h3 className="text-md font-semibold text-gray-700 mt-6">Sexual and Reproductive Health</h3>
              
              {/* Consequences of sexual violence */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Consequences of sexual violence (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  {formOptions.sexualHealthIssueOptions.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox 
                        id={`sexual-${option}`} 
                        checked={physicalData.sexualHealthIssues.includes(option)}
                        onCheckedChange={(checked) => handleSexualHealthIssuesChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`sexual-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                    </div>
                  ))}
                </div>
                
                {/* Medical care accessed */}
                <div className="mt-4">
                  <Label className="block text-sm font-medium text-gray-700">Has medical care been accessed for these issues?</Label>
                  <RadioGroup 
                    value={physicalData.medicalCareAccessed} 
                    onValueChange={(value) => handleInputChange('medicalCareAccessed', value as 'Yes' | 'No')}
                    className="mt-2 space-x-4"
                  >
                    <div className="inline-flex items-center">
                      <RadioGroupItem value="Yes" id="medical-care-yes" />
                      <Label htmlFor="medical-care-yes" className="ml-2">Yes</Label>
                    </div>
                    <div className="inline-flex items-center">
                      <RadioGroupItem value="No" id="medical-care-no" />
                      <Label htmlFor="medical-care-no" className="ml-2">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </>
          )}

          <h3 className="text-md font-semibold text-gray-700 mt-6">Sleep and Fatigue</h3>
          
          {/* Sleep disturbances */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Sleep disturbances (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.sleepDisturbanceOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`sleep-${option}`} 
                    checked={physicalData.sleepDisturbances.includes(option)}
                    onCheckedChange={(checked) => handleSleepDisturbancesChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`sleep-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mt-6">Functional Well-being</h3>
          
          {/* Impact on daily living */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Impact on work or earning a living</Label>
            <Select 
              value={physicalData.workImpact} 
              onValueChange={(value) => handleInputChange('workImpact', value)}
            >
              <SelectTrigger id="work-impact" className="w-full">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.workImpactOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Healthcare Access */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Barriers to healthcare access (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.healthcareBarrierOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`barrier-${option}`} 
                    checked={physicalData.healthcareBarriers.includes(option)}
                    onCheckedChange={(checked) => handleHealthcareBarriersChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`barrier-${option}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Unmet medical needs */}
          <div>
            <Label htmlFor="unmet-needs" className="block text-sm font-medium text-gray-700">Unmet ongoing medical needs</Label>
            <Textarea 
              id="unmet-needs" 
              value={physicalData.unmetMedicalNeeds}
              onChange={(e) => handleInputChange('unmetMedicalNeeds', e.target.value)}
              rows={3} 
              className="mt-1 block w-full rounded-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalWellbeing;
