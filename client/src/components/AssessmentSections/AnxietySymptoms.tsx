import React, { useEffect } from 'react';
import { useFormContext } from "@/lib/formContext";
import { formOptions, anxietyScoreInterpretation } from "@/lib/assessmentUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const AnxietySymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const { anxietySymptoms } = formData;
  const { scores, totalScore } = anxietySymptoms;

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
      updateFormData('anxietySymptoms', { totalScore: newTotalScore });
    }
  }, [scores, totalScore, updateFormData]);

  // Handle score change for a specific question
  const handleScoreChange = (questionIndex: number, value: string) => {
    const newScores = [...scores];
    newScores[questionIndex] = parseInt(value);
    updateFormData('anxietySymptoms', { scores: newScores });
  };

  // Get interpretation of anxiety score
  const scoreResult = anxietyScoreInterpretation(totalScore);
  const progressColor = {
    'none': 'bg-green-500',
    'mild': 'bg-yellow-500',
    'moderate': 'bg-orange-500',
    'severe': 'bg-red-500'
  }[scoreResult.severity];

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Anxiety Symptoms Assessment (GAD-7)</h2>
            <p className="text-gray-500 mb-6">
              Over the last 2 weeks, how often have you been bothered by the following problems?
            </p>
          </div>

          <div className="space-y-6">
            {formOptions.anxietyQuestions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <Label className="font-medium text-gray-900 mb-3 block">{question}</Label>
                <RadioGroup
                  value={scores[index].toString()}
                  onValueChange={(value) => handleScoreChange(index, value)}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {scoreOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 bg-gray-50 rounded p-3 hover:bg-gray-100 cursor-pointer">
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
            <h3 className="font-semibold text-gray-900">Anxiety Score: {totalScore}/21</h3>
            <span className={scoreResult.color}>{scoreResult.level}</span>
          </div>
          
          <Progress value={(totalScore / 21) * 100} className={`h-2 ${progressColor}`} />
          
          <div className="grid grid-cols-4 text-xs text-gray-500 mt-1">
            <div>Minimal (0-4)</div>
            <div>Mild (5-9)</div>
            <div>Moderate (10-14)</div>
            <div className="text-right">Severe (15-21)</div>
          </div>
        </div>

        {scoreResult.severity === 'severe' && (
          <Alert className="mt-4 border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>High Anxiety Score Detected</AlertTitle>
            <AlertDescription>
              This score indicates severe anxiety symptoms that may require immediate attention.
              Consider discussing these results with a mental health professional.
            </AlertDescription>
          </Alert>
        )}

        {scoreResult.severity === 'moderate' && (
          <Alert className="mt-4 border-orange-300 bg-orange-50 text-orange-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Moderate Anxiety Score</AlertTitle>
            <AlertDescription>
              This score suggests significant anxiety symptoms.
              Follow-up with a healthcare provider is recommended.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default AnxietySymptoms;