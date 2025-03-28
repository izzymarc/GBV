import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions } from "@/lib/assessmentUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PhysicalWellbeing: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { physicalWellbeing } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('physicalWellbeing', {
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    updateFormData('physicalWellbeing', {
      [field]: value
    });
  };

  const handlePhysicalInjuryChange = (value: string, checked: boolean) => {
    const currentInjuries = [...physicalWellbeing.physicalInjuries];
    
    if (checked) {
      if (!currentInjuries.includes(value)) {
        updateFormData('physicalWellbeing', {
          physicalInjuries: [...currentInjuries, value]
        });
      }
    } else {
      updateFormData('physicalWellbeing', {
        physicalInjuries: currentInjuries.filter(v => v !== value)
      });
    }
  };

  const handleSexualHealthIssueChange = (value: string, checked: boolean) => {
    const currentIssues = [...physicalWellbeing.sexualHealthIssues];
    
    if (checked) {
      if (!currentIssues.includes(value)) {
        updateFormData('physicalWellbeing', {
          sexualHealthIssues: [...currentIssues, value]
        });
      }
    } else {
      updateFormData('physicalWellbeing', {
        sexualHealthIssues: currentIssues.filter(v => v !== value)
      });
    }
  };

  const handleSleepDisturbanceChange = (value: string, checked: boolean) => {
    const currentDisturbances = [...physicalWellbeing.sleepDisturbances];
    
    if (checked) {
      if (!currentDisturbances.includes(value)) {
        updateFormData('physicalWellbeing', {
          sleepDisturbances: [...currentDisturbances, value]
        });
      }
    } else {
      updateFormData('physicalWellbeing', {
        sleepDisturbances: currentDisturbances.filter(v => v !== value)
      });
    }
  };

  const handleHealthcareBarrierChange = (value: string, checked: boolean) => {
    const currentBarriers = [...physicalWellbeing.healthcareBarriers];
    
    if (checked) {
      if (!currentBarriers.includes(value)) {
        updateFormData('physicalWellbeing', {
          healthcareBarriers: [...currentBarriers, value]
        });
      }
    } else {
      updateFormData('physicalWellbeing', {
        healthcareBarriers: currentBarriers.filter(v => v !== value)
      });
    }
  };

  // Check for medical attention needs
  const needsMedicalAttention = 
    physicalWellbeing.physicalInjuries.length > 0 && 
    !physicalWellbeing.physicalInjuries.includes('None');

  // Check for sexual health issues
  const hasSexualHealthIssues = 
    physicalWellbeing.sexualHealthIssues.length > 0 && 
    !physicalWellbeing.sexualHealthIssues.includes('None');

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Physical and Functional Well-being</h2>
            <p className="text-gray-500 mb-6">Assessment of physical health and impact on functioning</p>
          </div>

          {/* Medical Alert */}
          {needsMedicalAttention && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Medical Attention Recommended</AlertTitle>
              <AlertDescription>
                The client has reported physical injuries that may require medical attention. Consider referring them to appropriate medical services.
              </AlertDescription>
            </Alert>
          )}

          {/* Sexual Health Alert */}
          {hasSexualHealthIssues && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sexual Health Care Needed</AlertTitle>
              <AlertDescription>
                The client has reported sexual health issues. Consider referring them to specialized healthcare services for appropriate care.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Overall Health */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How would you rate your overall physical health?</Label>
              <RadioGroup
                value={physicalWellbeing.overallHealth || ''}
                onValueChange={(value) => handleRadioChange('overallHealth', value)}
                className="flex space-x-4"
              >
                {formOptions.overallHealthOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`health-${option}`} />
                    <Label htmlFor={`health-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Physical Injuries */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Are you currently experiencing any physical injuries related to the incident(s)?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formOptions.physicalInjuryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`injury-${option}`} 
                      checked={physicalWellbeing.physicalInjuries.includes(option)}
                      onCheckedChange={(checked) => handlePhysicalInjuryChange(option, !!checked)}
                    />
                    <Label htmlFor={`injury-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sexual Health Issues */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Are you experiencing any sexual or reproductive health issues?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formOptions.sexualHealthIssueOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sexual-health-${option}`} 
                      checked={physicalWellbeing.sexualHealthIssues.includes(option)}
                      onCheckedChange={(checked) => handleSexualHealthIssueChange(option, !!checked)}
                    />
                    <Label htmlFor={`sexual-health-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleep Disturbances */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Are you experiencing any sleep disturbances?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formOptions.sleepDisturbanceOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sleep-${option}`} 
                      checked={physicalWellbeing.sleepDisturbances.includes(option)}
                      onCheckedChange={(checked) => handleSleepDisturbanceChange(option, !!checked)}
                    />
                    <Label htmlFor={`sleep-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Medical Care */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Have you received medical care for any injuries or health issues related to the incident(s)?</Label>
              <RadioGroup
                value={physicalWellbeing.medicalCareAccessed || ''}
                onValueChange={(value) => handleRadioChange('medicalCareAccessed', value as 'Yes' | 'No')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="care-yes" />
                  <Label htmlFor="care-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="care-no" />
                  <Label htmlFor="care-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Healthcare Barriers */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Are there any barriers preventing you from accessing healthcare?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formOptions.healthcareBarrierOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`barrier-${option}`} 
                      checked={physicalWellbeing.healthcareBarriers.includes(option)}
                      onCheckedChange={(checked) => handleHealthcareBarrierChange(option, !!checked)}
                    />
                    <Label htmlFor={`barrier-${option}`} className="text-sm font-normal cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Unmet Medical Needs */}
            <div className="space-y-2">
              <Label htmlFor="unmetMedicalNeeds">
                Are there any unmet health care needs you'd like to address?
              </Label>
              <Textarea
                id="unmetMedicalNeeds"
                name="unmetMedicalNeeds"
                value={physicalWellbeing.unmetMedicalNeeds || ''}
                onChange={handleInputChange}
                placeholder="Please describe any health needs that aren't currently being addressed..."
                className="min-h-[80px]"
              />
            </div>

            {/* Work Impact */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How has the incident(s) affected your ability to work or perform daily activities?</Label>
              <RadioGroup
                value={physicalWellbeing.workImpact || ''}
                onValueChange={(value) => handleRadioChange('workImpact', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No impact" id="work-none" />
                  <Label htmlFor="work-none" className="cursor-pointer">No impact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mild impact" id="work-mild" />
                  <Label htmlFor="work-mild" className="cursor-pointer">Mild impact - Some difficulty but managing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Moderate impact" id="work-moderate" />
                  <Label htmlFor="work-moderate" className="cursor-pointer">Moderate impact - Significant difficulty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Severe impact" id="work-severe" />
                  <Label htmlFor="work-severe" className="cursor-pointer">Severe impact - Cannot work/perform most activities</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p><strong>Note to assessor:</strong> If client reports sleep disturbances ({physicalWellbeing.sleepDisturbances.length > 0 && !physicalWellbeing.sleepDisturbances.includes('None') ? 'current concern' : 'not currently a concern'}), consider further assessment for depression and anxiety.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalWellbeing;