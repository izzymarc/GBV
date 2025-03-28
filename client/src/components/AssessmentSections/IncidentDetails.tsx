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
import { AlertTriangle } from 'lucide-react';

const IncidentDetails: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const incidentDetails = formData.incidentDetails;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('incidentDetails', { [field]: value });
  };

  const handleViolenceTypeChange = (value: string, checked: boolean) => {
    const currentValues = [...incidentDetails.violenceTypes];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!currentValues.includes(value)) {
        updateFormData('incidentDetails', { 
          violenceTypes: [...currentValues, value] 
        });
      }
    } else {
      // Remove the value
      updateFormData('incidentDetails', { 
        violenceTypes: currentValues.filter(item => item !== value) 
      });
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">2. Incident Details</h2>
          <div className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Sensitive Section</div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This section contains sensitive questions about the incident. The survivor may choose to skip any questions they are not comfortable answering.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Location of incident */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Location of incident</Label>
            <RadioGroup 
              value={incidentDetails.location} 
              onValueChange={(value) => handleInputChange('location', value)}
              className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4"
            >
              {formOptions.incidentLocationOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <RadioGroupItem value={option} id={`loc-${option}`} />
                  <Label htmlFor={`loc-${option}`} className="ml-2">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Type of Violence Experienced */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Type of Violence Experienced (select all that apply)</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formOptions.violenceTypeOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <Checkbox 
                    id={`violence-${index}`} 
                    checked={incidentDetails.violenceTypes.includes(option)}
                    onCheckedChange={(checked) => handleViolenceTypeChange(option, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`violence-${index}`} 
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship with Perpetrator */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Relationship with Perpetrator</Label>
            <RadioGroup 
              value={incidentDetails.perpetratorRelationship} 
              onValueChange={(value) => handleInputChange('perpetratorRelationship', value)}
              className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4"
            >
              {formOptions.perpetratorRelationshipOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <RadioGroupItem value={option} id={`perp-rel-${index}`} />
                  <Label htmlFor={`perp-rel-${index}`} className="ml-2 text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Frequency of Incidents */}
          <div>
            <Label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency of Incidents</Label>
            <Select 
              value={incidentDetails.frequency} 
              onValueChange={(value) => handleInputChange('frequency', value)}
            >
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.frequencyOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Length of Exposure */}
          <div>
            <Label htmlFor="exposure" className="block text-sm font-medium text-gray-700">Length of Exposure</Label>
            <Select 
              value={incidentDetails.exposure} 
              onValueChange={(value) => handleInputChange('exposure', value)}
            >
              <SelectTrigger id="exposure" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.exposureOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reporting Status */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Has this incident been reported to authorities?</Label>
            <RadioGroup 
              value={incidentDetails.reportingStatus} 
              onValueChange={(value) => handleInputChange('reportingStatus', value as 'Yes' | 'No')}
              className="mt-2 space-x-4"
            >
              <div className="inline-flex items-center">
                <RadioGroupItem value="Yes" id="report-yes" />
                <Label htmlFor="report-yes" className="ml-2">Yes</Label>
              </div>
              <div className="inline-flex items-center">
                <RadioGroupItem value="No" id="report-no" />
                <Label htmlFor="report-no" className="ml-2">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Services Received */}
          <div>
            <Label htmlFor="services" className="block text-sm font-medium text-gray-700">Services Received (if any)</Label>
            <Textarea 
              id="services" 
              value={incidentDetails.servicesReceived}
              onChange={(e) => handleInputChange('servicesReceived', e.target.value)}
              rows={3} 
              className="mt-1 block w-full rounded-md"
            />
          </div>

          {/* Outcome */}
          <div>
            <Label htmlFor="outcome" className="block text-sm font-medium text-gray-700">Outcome (if reported/services received)</Label>
            <Textarea 
              id="outcome" 
              value={incidentDetails.outcome}
              onChange={(e) => handleInputChange('outcome', e.target.value)}
              rows={3} 
              className="mt-1 block w-full rounded-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentDetails;
