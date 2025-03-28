import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const GeneralInformation: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const generalInfo = formData.generalInformation;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('generalInformation', { [field]: value });
  };

  const handleVulnerabilityChange = (value: string, checked: boolean) => {
    const currentValues = [...generalInfo.vulnerabilities];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!currentValues.includes(value)) {
        updateFormData('generalInformation', { 
          vulnerabilities: [...currentValues, value] 
        });
      }
    } else {
      // Remove the value
      updateFormData('generalInformation', { 
        vulnerabilities: currentValues.filter(item => item !== value) 
      });
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">1. General Information</h2>
        <p className="text-gray-600 mb-6">Basic demographic information about the survivor/client.</p>

        <div className="space-y-6">
          {/* Age */}
          <div>
            <Label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</Label>
            <Input 
              type="number" 
              id="age" 
              min="0" 
              max="120" 
              value={generalInfo.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Sex */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Sex</Label>
            <RadioGroup 
              value={generalInfo.sex} 
              onValueChange={(value) => handleInputChange('sex', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center">
                <RadioGroupItem value="Male" id="sex-male" />
                <Label htmlFor="sex-male" className="ml-2">Male</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="Female" id="sex-female" />
                <Label htmlFor="sex-female" className="ml-2">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ethnicity/Tribe */}
          <div>
            <Label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700">Ethnicity/Tribe</Label>
            <Input 
              type="text" 
              id="ethnicity" 
              value={generalInfo.ethnicity}
              onChange={(e) => handleInputChange('ethnicity', e.target.value)}
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Level of Education */}
          <div>
            <Label htmlFor="education" className="block text-sm font-medium text-gray-700">Level of Education</Label>
            <Select 
              value={generalInfo.education} 
              onValueChange={(value) => handleInputChange('education', value)}
            >
              <SelectTrigger id="education" className="w-full">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.educationOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Marital Status */}
          <div>
            <Label htmlFor="marital-status" className="block text-sm font-medium text-gray-700">Marital Status</Label>
            <Select 
              value={generalInfo.maritalStatus} 
              onValueChange={(value) => handleInputChange('maritalStatus', value)}
            >
              <SelectTrigger id="marital-status" className="w-full">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.maritalStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Dependents */}
          <div>
            <Label htmlFor="dependents" className="block text-sm font-medium text-gray-700">Number of Dependents</Label>
            <Input 
              type="number" 
              id="dependents" 
              min="0" 
              value={generalInfo.dependents}
              onChange={(e) => handleInputChange('dependents', e.target.value)}
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Current Living Arrangement */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Current Living Arrangement</Label>
            <RadioGroup 
              value={generalInfo.livingArrangement} 
              onValueChange={(value) => handleInputChange('livingArrangement', value)}
              className="mt-2 space-y-2"
            >
              {formOptions.livingArrangementOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <RadioGroupItem value={option} id={`living-${option}`} />
                  <Label htmlFor={`living-${option}`} className="ml-2">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Employment Status */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</Label>
            <RadioGroup 
              value={generalInfo.employmentStatus} 
              onValueChange={(value) => handleInputChange('employmentStatus', value)}
              className="mt-2 space-y-2"
            >
              {formOptions.employmentStatusOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <RadioGroupItem value={option} id={`emp-${option}`} />
                  <Label htmlFor={`emp-${option}`} className="ml-2">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Vulnerability */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Vulnerability (select all that apply)</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.vulnerabilityOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <Checkbox 
                    id={`vulnerability-${index}`} 
                    checked={generalInfo.vulnerabilities.includes(option)}
                    onCheckedChange={(checked) => handleVulnerabilityChange(option, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`vulnerability-${index}`} 
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInformation;
