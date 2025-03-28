import React, { useEffect } from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions, depressionScoreInterpretation } from "@/lib/assessmentUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const DepressionSymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { depressionSymptoms } = formData;
  const { scores, totalScore } = depressionSymptoms;

  // Score options with labels
  const scoreOptions = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  // Calculate total score when scores change
  useEffect(() => {
    const newTotalScore = scores.reduce((sum, score) => sum + score, 0);
    if (newTotalScore !== totalScore) {
      updateFormData('depressionSymptoms', { totalScore: newTotalScore });
    }
  }, [scores, totalScore, updateFormData]);

  // Handle score change for a specific question
  const handleScoreChange = (questionIndex: number, value: string) => {
    const newScores = [...scores];
    newScores[questionIndex] = parseInt(value);
    updateFormData('depressionSymptoms', { scores: newScores });
  };

  // Get interpretation of depression score
  const scoreResult = depressionScoreInterpretation(totalScore);
  const progressColor = {
    'none': 'bg-green-500',
    'mild': 'bg-yellow-500',
    'moderate': 'bg-orange-500',
    'moderately-severe': 'bg-orange-600',
    'severe': 'bg-red-500'
  }[scoreResult.severity];

  // Check for suicidal ideation (question 9 in PHQ-9)
  const hasSuicidalIdeation = scores[8] >= 1;

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Depression Symptoms Assessment (PHQ-9)</h2>
            <p className="text-gray-500 mb-6">
              Over the last 2 weeks, how often have you been bothered by the following problems?
            </p>
          </div>

          <div className="space-y-6">
            {formOptions.depressionQuestions.map((question, index) => (
              <div 
                key={index} 
                className={`border border-gray-200 rounded-lg p-4 bg-white ${
                  index === 8 ? 'border-red-200 bg-red-50' : ''
                }`}
              >
                <Label 
                  className={`font-medium mb-3 block ${
                    index === 8 ? 'text-red-800' : 'text-gray-900'
                  }`}
                >
                  {question}
                  {index === 8 && <span className="text-xs ml-2 text-red-700">(Critical question)</span>}
                </Label>
                <RadioGroup
                  value={scores[index].toString()}
                  onValueChange={(value) => handleScoreChange(index, value)}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {scoreOptions.map((option) => (
                    <div 
                      key={option.value} 
                      className={`flex items-center space-x-2 rounded p-3 hover:bg-gray-100 cursor-pointer ${
                        index === 8 && option.value > 0 
                          ? 'bg-red-100 hover:bg-red-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`q${index}-${option.value}`} />
                      <Label 
                        htmlFor={`q${index}-${option.value}`} 
                        className="text-sm cursor-pointer w-full"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-6 border-t">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Depression Score: {totalScore}/27</h3>
            <span className={scoreResult.color}>{scoreResult.level}</span>
          </div>
          
          <Progress value={(totalScore / 27) * 100} className={`h-2 ${progressColor}`} />
          
          <div className="grid grid-cols-5 text-xs text-gray-500 mt-1">
            <div>Minimal (0-4)</div>
            <div>Mild (5-9)</div>
            <div>Moderate (10-14)</div>
            <div>Mod-Severe (15-19)</div>
            <div className="text-right">Severe (20-27)</div>
          </div>
        </div>

        {hasSuicidalIdeation && (
          <Alert className="mt-4 border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Suicide Risk Alert</AlertTitle>
            <AlertDescription>
              The client has indicated thoughts of self-harm or suicide. 
              This requires immediate attention and assessment by a trained mental health professional.
              Consider using the National Suicide Prevention Lifeline: 1-800-273-8255
            </AlertDescription>
          </Alert>
        )}

        {scoreResult.severity === 'severe' && (
          <Alert className="mt-4 border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Severe Depression Symptoms Detected</AlertTitle>
            <AlertDescription>
              This score indicates severe depression that requires immediate professional attention.
              Consider referral to mental health services for evaluation.
            </AlertDescription>
          </Alert>
        )}

        {scoreResult.severity === 'moderately-severe' && (
          <Alert className="mt-4 border-orange-300 bg-orange-50 text-orange-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Moderately Severe Depression Symptoms</AlertTitle>
            <AlertDescription>
              This score suggests significant depression symptoms.
              Recommend assessment by a mental health professional.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default DepressionSymptoms;