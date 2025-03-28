import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from '@/lib/formContext';
import { formOptions, anxietyScoreInterpretation } from '@/lib/assessmentUtils';

const AnxietySymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const anxietyData = formData.anxietySymptoms;

  // Calculate total score whenever individual scores change
  useEffect(() => {
    const totalScore = anxietyData.scores.reduce((sum, score) => sum + score, 0);
    if (totalScore !== anxietyData.totalScore) {
      updateFormData('anxietySymptoms', { totalScore });
    }
  }, [anxietyData.scores]);

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...anxietyData.scores];
    newScores[index] = value;
    updateFormData('anxietySymptoms', { scores: newScores });
  };

  const anxietyResult = anxietyScoreInterpretation(anxietyData.totalScore);

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">3. Anxiety Symptoms (GAD-7 Scale)</h2>
        <p className="text-gray-600 mb-6">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>

        {/* Scale explanation */}
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Rating scale:</h3>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-y-2">
            <div className="text-sm text-gray-600"><span className="font-medium">0:</span> Not at all</div>
            <div className="text-sm text-gray-600"><span className="font-medium">1:</span> Several days</div>
            <div className="text-sm text-gray-600"><span className="font-medium">2:</span> More than half the days</div>
            <div className="text-sm text-gray-600"><span className="font-medium">3:</span> Nearly every day</div>
          </div>
        </div>

        <div className="space-y-6">
          {formOptions.anxietyQuestions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <div className="mb-3">
                <Label htmlFor={`anxiety-${index}`} className="block text-sm font-medium text-gray-700">
                  {question}
                </Label>
              </div>
              <RadioGroup
                value={anxietyData.scores[index].toString()}
                onValueChange={(value) => handleScoreChange(index, parseInt(value))}
                className="flex space-x-4 md:space-x-6"
              >
                {[0, 1, 2, 3].map((score) => (
                  <div key={score} className="flex items-center">
                    <RadioGroupItem value={score.toString()} id={`anxiety-${index}-${score}`} />
                    <Label htmlFor={`anxiety-${index}-${score}`} className="ml-1 text-sm text-gray-700">
                      {score}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* GAD-7 Score Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">Total GAD-7 Score:</div>
              <div className="text-lg font-bold text-primary-700">{anxietyData.totalScore}</div>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-700 mb-1">Interpretation:</div>
              <div className={`text-sm ${anxietyResult.color}`}>
                {anxietyResult.level}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnxietySymptoms;
