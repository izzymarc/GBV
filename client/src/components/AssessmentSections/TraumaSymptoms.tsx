import React, { useEffect } from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions, traumaScoreInterpretation, traumaBondingScoreInterpretation } from "@/lib/assessmentUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const TraumaSymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { traumaSymptoms } = formData;
  const { ptsdScores, bondingScores, ptsdTotalScore, bondingTotalScore } = traumaSymptoms;

  // Score options for PTSD symptoms
  const ptsdScoreOptions = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'A little bit' },
    { value: 2, label: 'Moderately' },
    { value: 3, label: 'Quite a bit' },
    { value: 4, label: 'Extremely' }
  ];

  // Score options for trauma bonding
  const bondingScoreOptions = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Very often' }
  ];

  // Calculate PTSD total score when scores change
  useEffect(() => {
    const newPtsdTotal = ptsdScores.reduce((sum, score) => sum + score, 0);
    if (newPtsdTotal !== ptsdTotalScore) {
      updateFormData('traumaSymptoms', { ptsdTotalScore: newPtsdTotal });
    }
  }, [ptsdScores, ptsdTotalScore, updateFormData]);

  // Calculate trauma bonding total score when scores change
  useEffect(() => {
    const newBondingTotal = bondingScores.reduce((sum, score) => sum + score, 0);
    if (newBondingTotal !== bondingTotalScore) {
      updateFormData('traumaSymptoms', { bondingTotalScore: newBondingTotal });
    }
  }, [bondingScores, bondingTotalScore, updateFormData]);

  // Handle PTSD score change
  const handlePtsdScoreChange = (questionIndex: number, value: string) => {
    const newScores = [...ptsdScores];
    newScores[questionIndex] = parseInt(value);
    updateFormData('traumaSymptoms', { ptsdScores: newScores });
  };

  // Handle trauma bonding score change
  const handleBondingScoreChange = (questionIndex: number, value: string) => {
    const newScores = [...bondingScores];
    newScores[questionIndex] = parseInt(value);
    updateFormData('traumaSymptoms', { bondingScores: newScores });
  };

  // Get interpretations
  const ptsdResult = traumaScoreInterpretation(ptsdTotalScore);
  const bondingResult = traumaBondingScoreInterpretation(bondingTotalScore);

  // Progress bar colors
  const ptsdProgressColor = {
    'none': 'bg-green-500',
    'moderate': 'bg-orange-500',
    'severe': 'bg-red-500'
  }[ptsdResult.severity];

  const bondingProgressColor = {
    'none': 'bg-green-500',
    'mild': 'bg-yellow-500',
    'moderate': 'bg-orange-500',
    'severe': 'bg-red-500'
  }[bondingResult.severity];

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Trauma Symptoms Assessment</h2>
            <p className="text-gray-500 mb-4">
              This assessment evaluates trauma symptoms and trauma bonding experiences
            </p>
          </div>

          <Tabs defaultValue="ptsd" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="ptsd">PTSD Symptoms</TabsTrigger>
              <TabsTrigger value="bonding">Trauma Bonding</TabsTrigger>
            </TabsList>

            {/* PTSD Symptoms Tab */}
            <TabsContent value="ptsd" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-1">PTSD Screening (PCL-5 Modified)</h3>
                <p className="text-sm text-blue-700">
                  In the past month, how much have you been bothered by the following problems?
                </p>
              </div>

              {formOptions.traumaQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <Label className="font-medium text-gray-900 mb-3 block">{question}</Label>
                  <RadioGroup
                    value={ptsdScores[index].toString()}
                    onValueChange={(value) => handlePtsdScoreChange(index, value)}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                  >
                    {ptsdScoreOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 bg-gray-50 rounded p-2 hover:bg-gray-100 cursor-pointer">
                        <RadioGroupItem value={option.value.toString()} id={`ptsd-${index}-${option.value}`} />
                        <Label 
                          htmlFor={`ptsd-${index}-${option.value}`} 
                          className="text-sm cursor-pointer w-full"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">PTSD Symptom Score: {ptsdTotalScore}/24</h3>
                  <span className={ptsdResult.color}>{ptsdResult.level}</span>
                </div>
                
                <Progress value={(ptsdTotalScore / 24) * 100} className={`h-2 ${ptsdProgressColor}`} />
                
                <div className="grid grid-cols-3 text-xs text-gray-500 mt-1">
                  <div>Below threshold (0-19)</div>
                  <div>Concerning symptoms (20-32)</div>
                  <div className="text-right">Probable PTSD (33+)</div>
                </div>

                {ptsdResult.severity === 'severe' && (
                  <Alert className="mt-4 border-red-300 bg-red-50 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Elevated PTSD Symptoms</AlertTitle>
                    <AlertDescription>
                      This score indicates symptoms consistent with PTSD diagnosis. 
                      Recommend formal assessment by a trauma-informed mental health professional.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            {/* Trauma Bonding Tab */}
            <TabsContent value="bonding" className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-purple-800 mb-1">Trauma Bonding Assessment</h3>
                <p className="text-sm text-purple-700">
                  How often do you experience the following in relation to the person who harmed you?
                </p>
              </div>

              {formOptions.traumaBondingQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <Label className="font-medium text-gray-900 mb-3 block">{question}</Label>
                  <RadioGroup
                    value={bondingScores[index].toString()}
                    onValueChange={(value) => handleBondingScoreChange(index, value)}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                  >
                    {bondingScoreOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 bg-gray-50 rounded p-2 hover:bg-gray-100 cursor-pointer">
                        <RadioGroupItem value={option.value.toString()} id={`bonding-${index}-${option.value}`} />
                        <Label 
                          htmlFor={`bonding-${index}-${option.value}`} 
                          className="text-sm cursor-pointer w-full"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Trauma Bonding Score: {bondingTotalScore}/40</h3>
                  <span className={bondingResult.color}>{bondingResult.level}</span>
                </div>
                
                <Progress value={(bondingTotalScore / 40) * 100} className={`h-2 ${bondingProgressColor}`} />
                
                <div className="grid grid-cols-4 text-xs text-gray-500 mt-1">
                  <div>Minimal (0-9)</div>
                  <div>Mild (10-19)</div>
                  <div>Moderate (20-29)</div>
                  <div className="text-right">Severe (30-40)</div>
                </div>

                {bondingResult.severity === 'severe' && (
                  <Alert className="mt-4 border-red-300 bg-red-50 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Significant Trauma Bonding</AlertTitle>
                    <AlertDescription>
                      This score indicates severe trauma bonding which may complicate recovery.
                      Specialized trauma-informed therapy approaches are recommended.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-6 border-t">
        {/* Combined assessment summary */}
        {(ptsdResult.severity === 'severe' || bondingResult.severity === 'severe') && (
          <Alert className="mt-4 w-full border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Trauma-Focused Care Recommended</AlertTitle>
            <AlertDescription>
              Based on this assessment, the client would benefit from trauma-focused therapy approaches.
              Consider referral to a therapist specialized in trauma recovery and GBV.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default TraumaSymptoms;