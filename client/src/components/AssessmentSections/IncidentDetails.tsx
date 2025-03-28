import React from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions } from "@/lib/assessmentUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Info } from 'lucide-react';

const IncidentDetails: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { incidentDetails } = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData('incidentDetails', {
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData('incidentDetails', {
      [name]: value
    });
  };

  const handleReportingStatusChange = (value: string) => {
    updateFormData('incidentDetails', {
      reportingStatus: value
    });
  };

  const handleViolenceTypeChange = (value: string, checked: boolean) => {
    const currentViolenceTypes = [...incidentDetails.violenceTypes];
    
    if (checked) {
      if (!currentViolenceTypes.includes(value)) {
        updateFormData('incidentDetails', {
          violenceTypes: [...currentViolenceTypes, value]
        });
      }
    } else {
      updateFormData('incidentDetails', {
        violenceTypes: currentViolenceTypes.filter(v => v !== value)
      });
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Incident Details</h2>
            <p className="text-gray-500 mb-6">Details about the gender-based violence incident(s)</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Privacy & Confidentiality</p>
              <p>This information is strictly confidential and will only be used to provide appropriate support services. 
              You can skip any questions that make you uncomfortable.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Violence Types */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type of Violence (select all that apply) <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formOptions.violenceTypeOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`violence-${option}`}
                      checked={incidentDetails.violenceTypes.includes(option)}
                      onCheckedChange={(checked) => handleViolenceTypeChange(option, !!checked)}
                    />
                    <Label 
                      htmlFor={`violence-${option}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Incident Location</Label>
                <Select 
                  value={incidentDetails.location || ''} 
                  onValueChange={(value) => handleSelectChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident location" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.incidentLocationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Perpetrator Relationship */}
              <div className="space-y-2">
                <Label htmlFor="perpetratorRelationship">Relationship to Perpetrator</Label>
                <Select 
                  value={incidentDetails.perpetratorRelationship || ''} 
                  onValueChange={(value) => handleSelectChange('perpetratorRelationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.perpetratorRelationshipOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency of Incidents</Label>
                <Select 
                  value={incidentDetails.frequency || ''} 
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.frequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exposure Duration */}
              <div className="space-y-2">
                <Label htmlFor="exposure">Duration of Exposure</Label>
                <Select 
                  value={incidentDetails.exposure || ''} 
                  onValueChange={(value) => handleSelectChange('exposure', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.exposureOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Reporting Status */}
            <div className="space-y-3">
              <Label>Has this incident been reported to authorities?</Label>
              <RadioGroup
                value={incidentDetails.reportingStatus || ''}
                onValueChange={handleReportingStatusChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="reporting-yes" />
                  <Label htmlFor="reporting-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="reporting-no" />
                  <Label htmlFor="reporting-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Services Received */}
            <div className="space-y-2">
              <Label htmlFor="servicesReceived">What services has the client already received?</Label>
              <Textarea
                id="servicesReceived"
                name="servicesReceived"
                value={incidentDetails.servicesReceived || ''}
                onChange={handleInputChange}
                placeholder="E.g., medical care, police intervention, counseling, etc."
                className="min-h-[80px]"
              />
            </div>

            {/* Outcome */}
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome of the incident/violence</Label>
              <Textarea
                id="outcome"
                name="outcome"
                value={incidentDetails.outcome || ''}
                onChange={handleInputChange}
                placeholder="Describe the current situation and the impact on the client..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentDetails;