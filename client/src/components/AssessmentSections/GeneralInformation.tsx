import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions } from "@/lib/assessmentUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeneralInformation: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { generalInformation } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('generalInformation', {
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData('generalInformation', {
      [name]: value
    });
  };

  const handleSexChange = (value: string) => {
    updateFormData('generalInformation', {
      sex: value
    });
  };

  const handleVulnerabilityChange = (value: string, checked: boolean) => {
    const currentVulnerabilities = [...generalInformation.vulnerabilities];
    
    if (checked) {
      if (!currentVulnerabilities.includes(value)) {
        updateFormData('generalInformation', {
          vulnerabilities: [...currentVulnerabilities, value]
        });
      }
    } else {
      updateFormData('generalInformation', {
        vulnerabilities: currentVulnerabilities.filter(v => v !== value)
      });
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">General Information</h2>
            <p className="text-gray-500 mb-6">Basic demographic information for the assessment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="text"
                value={generalInformation.age || ''}
                onChange={handleInputChange}
                placeholder="Enter age"
              />
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label>Sex</Label>
              <RadioGroup
                value={generalInformation.sex || ''}
                onValueChange={handleSexChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Ethnicity/Tribe */}
            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity/Tribe</Label>
              <Input
                id="ethnicity"
                name="ethnicity"
                type="text"
                value={generalInformation.ethnicity || ''}
                onChange={handleInputChange}
                placeholder="Enter ethnicity or tribe"
              />
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="education">Level of Education</Label>
              <Select 
                value={generalInformation.education || ''} 
                onValueChange={(value) => handleSelectChange('education', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.educationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select 
                value={generalInformation.maritalStatus || ''} 
                onValueChange={(value) => handleSelectChange('maritalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.maritalStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Dependents */}
            <div className="space-y-2">
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                name="dependents"
                type="text"
                value={generalInformation.dependents || ''}
                onChange={handleInputChange}
                placeholder="Enter number of dependents"
              />
            </div>

            {/* Living Arrangement */}
            <div className="space-y-2">
              <Label htmlFor="livingArrangement">Current Living Arrangement</Label>
              <Select 
                value={generalInformation.livingArrangement || ''} 
                onValueChange={(value) => handleSelectChange('livingArrangement', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select living arrangement" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.livingArrangementOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select 
                value={generalInformation.employmentStatus || ''} 
                onValueChange={(value) => handleSelectChange('employmentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.employmentStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vulnerabilities */}
          <div className="space-y-4 mt-6">
            <Label>Vulnerability (Select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formOptions.vulnerabilityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`vulnerability-${option}`}
                    checked={generalInformation.vulnerabilities.includes(option)}
                    onCheckedChange={(checked) => handleVulnerabilityChange(option, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`vulnerability-${option}`}
                    className="text-sm font-normal cursor-pointer"
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